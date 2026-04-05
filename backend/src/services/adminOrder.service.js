import prisma from '../db/prisma.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

class AdminOrderService {
  /**
   * Get all orders with pagination, filtering, and sorting
   * Includes user info and order items with products
   */
  async getAllOrders(page = 1, limit = 10, filters = {}, sortBy = 'created_at', sortOrder = 'desc') {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.payment_status) {
      where.payment_status = filters.payment_status;
    }
    if (filters.payment_type) {
      where.payment_type = filters.payment_type;
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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          order_items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  stock_quantity: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    };
  }

  /**
   * Get single order by ID (admin can view any order)
   */
  async getOrderById(orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                stock_quantity: true,
                is_active: true,
                deleted_at: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return { order };
  }

  /**
   * Update order status with validation and stock restoration
   */
  async updateOrderStatus(orderId, updates, adminId) {
    return await prisma.$transaction(async (tx) => {
      // Get current order with items
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { order_items: true },
      });

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      const oldStatus = order.status;
      const oldPaymentStatus = order.payment_status;
      const newStatus = updates.status;
      const newPaymentStatus = updates.payment_status;

      // Validate status transition if status is being updated
      if (newStatus && newStatus !== oldStatus) {
        this.validateStatusTransition(oldStatus, newStatus);
      }

      // Build update data
      const updateData = {};
      if (newStatus) updateData.status = newStatus;
      if (newPaymentStatus) updateData.payment_status = newPaymentStatus;

      // Update order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          order_items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  stock_quantity: true,
                },
              },
            },
          },
        },
      });

      // Handle stock restoration
      const shouldRestoreStock = this.shouldRestoreStock(
        oldStatus,
        newStatus,
        oldPaymentStatus,
        newPaymentStatus
      );

      if (shouldRestoreStock) {
        await this.restoreStockQuantities(tx, order.order_items);
        logger.info('Stock quantities restored for order', {
          orderId,
          adminId,
          reason: newStatus === 'cancelled' ? 'order_cancelled' : 'payment_refunded',
        });
      }

      // Log status change
      logger.info('Order status updated by admin', {
        orderId,
        adminId,
        oldStatus,
        newStatus,
        oldPaymentStatus,
        newPaymentStatus,
        stockRestored: shouldRestoreStock,
      });

      return { order: updatedOrder, stockRestored: shouldRestoreStock };
    });
  }

  /**
   * Validate if status transition is allowed
   */
  validateStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: [], // Terminal state
      cancelled: [], // Terminal state
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new ApiError(
        400,
        `Invalid status transition: cannot change from '${currentStatus}' to '${newStatus}'`
      );
    }
  }

  /**
   * Determine if stock should be restored based on status changes
   */
  shouldRestoreStock(oldStatus, newStatus, oldPaymentStatus, newPaymentStatus) {
    // Restore stock if order is being cancelled
    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      return true;
    }

    // Restore stock if payment is being refunded (from completed)
    if (
      newPaymentStatus === 'refunded' &&
      oldPaymentStatus === 'completed' &&
      newPaymentStatus !== oldPaymentStatus
    ) {
      return true;
    }

    return false;
  }

  /**
   * Restore product stock quantities for order items
   */
  async restoreStockQuantities(tx, orderItems) {
    await Promise.all(
      orderItems.map((item) =>
        tx.product.update({
          where: { id: item.product_id },
          data: { stock_quantity: { increment: item.quantity } },
        })
      )
    );
  }
}

export default new AdminOrderService();
