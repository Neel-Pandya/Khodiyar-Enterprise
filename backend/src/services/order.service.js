import prisma from '../db/prisma.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import emailService from './email.service.js';

class OrderService {
  /**
   * Create order from cart with transaction
   * Includes: stock validation (409 error), snapshot pricing, cart cleared at END
   */
  async createOrder(userId, userEmail, orderData) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch cart items with product details
      const cartItems = await tx.cart.findMany({
        where: { user_id: userId },
        include: { product: true }
      });

      if (cartItems.length === 0) {
        throw new ApiError(400, 'Cart is empty');
      }

      // 2. EXPLICIT stock validation - return 409 if insufficient
      for (const item of cartItems) {
        if (item.product.stock_quantity < item.quantity) {
          throw new ApiError(
            409,
            `Insufficient stock for ${item.product.name}. Available: ${item.product.stock_quantity}, Requested: ${item.quantity}`
          );
        }
        // Check if product is active
        if (!item.product.is_active || item.product.deleted_at) {
          throw new ApiError(409, `Product ${item.product.name} is no longer available`);
        }
      }

      // 3. Calculate total using current product prices (snapshot)
      const totalAmount = cartItems.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      // 4. Create order record (email from auth, NOT from body)
      const order = await tx.order.create({
        data: {
          user_id: userId,
          total_amount: totalAmount,
          status: 'pending',
          payment_type: orderData.payment_type,
          payment_status: 'pending',
          full_name: orderData.full_name,
          email: userEmail, // From auth context, not request body
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          pincode: orderData.pincode,
        }
      });

      // 5. Create order items with SNAPSHOT pricing
      const orderItems = await Promise.all(
        cartItems.map(item =>
          tx.orderItem.create({
            data: {
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.product.price // SNAPSHOT: Price at time of order
            }
          })
        )
      );

      // 6. Update product stock quantities
      await Promise.all(
        cartItems.map(item =>
          tx.product.update({
            where: { id: item.product_id },
            data: { stock_quantity: { decrement: item.quantity } }
          })
        )
      );

      // 7. Clear cart at END of transaction (race condition fix)
      await tx.cart.deleteMany({ where: { user_id: userId } });

      // Return order with items
      return {
        order: {
          ...order,
          order_items: orderItems
        }
      };
    });
  }

  /**
   * Get user's orders with pagination and sorting
   */
  async getUserOrders(userId, page = 1, limit = 10, status, sortBy = 'created_at', sortOrder = 'desc') {
    // Ensure page and limit are integers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = { user_id: userId };
    if (status) {
      where.status = status;
    }

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          order_items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    };
  }

  /**
   * Get single order by ID (with user verification)
   */
  async getOrderById(userId, orderId) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, user_id: userId },
      include: {
        order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true // Current price for reference
              }
            }
          }
        }
      }
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return { order };
  }

  /**
   * Cancel order - only pending orders can be cancelled
   */
  async cancelOrder(userId, orderId) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, user_id: userId },
        include: { order_items: true }
      });

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      // Only allow cancelling pending orders
      if (order.status !== 'pending') {
        throw new ApiError(400, 'Only pending orders can be cancelled');
      }

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
        include: { order_items: true }
      });

      // Restore stock quantities
      await Promise.all(
        order.order_items.map(item =>
          tx.product.update({
            where: { id: item.product_id },
            data: { stock_quantity: { increment: item.quantity } }
          })
        )
      );

      // Send cancellation email (outside transaction - best effort)
      try {
        await emailService.sendOrderCancellationEmail(order.email, order.full_name, updatedOrder);
      } catch (emailError) {
        logger.error('Failed to send cancellation email', { error: emailError.message });
      }

      return { order: updatedOrder };
    });
  }

  /**
   * Send order confirmation email (called after successful order creation)
   */
  async sendOrderConfirmation(order, orderItems) {
    try {
      // Fetch product names for order items
      const productIds = orderItems.map(item => item.product_id);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
      });
      
      // Attach product names to order items
      const orderItemsWithProduct = orderItems.map(item => ({
        ...item,
        product: products.find(p => p.id === item.product_id)
      }));
      
      await emailService.sendOrderConfirmationEmail(order.email, order.full_name, order, orderItemsWithProduct);
    } catch (emailError) {
      logger.error('Failed to send order confirmation email', { error: emailError.message });
    }
  }
}

export default new OrderService();
