import prisma from '../db/prisma.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

class CartService {
  /**
   * Add to cart with transaction wrapper
   * Returns { isNewItem: boolean, cartItem: object }
   */
  async addToCart(userId, productId) {
    return await prisma.$transaction(async (tx) => {
      // Check for existing cart item within transaction
      const existingItem = await tx.cart.findUnique({
        where: {
          user_id_product_id: { user_id: userId, product_id: productId }
        },
        include: { product: true }
      });

      if (existingItem) {
        // Edge case: Check if product is still active
        if (!existingItem.product.is_active || existingItem.product.deleted_at) {
          await tx.cart.delete({ where: { id: existingItem.id } });
          return { isRemoved: true, reason: 'Product is no longer available' };
        }

        // Edge case: If stock is 0, auto-remove from cart
        if (existingItem.product.stock_quantity <= 0) {
          await tx.cart.delete({ where: { id: existingItem.id } });
          return { isRemoved: true, reason: 'Product is out of stock' };
        }

        // Check if we can increment (stock check)
        if (existingItem.quantity >= existingItem.product.stock_quantity) {
          throw new ApiError(400, `Only ${existingItem.product.stock_quantity} items available`);
        }

        // Increment quantity
        const updated = await tx.cart.update({
          where: { id: existingItem.id },
          data: { quantity: { increment: 1 } },
          include: {
            product: { include: { category: true } }
          }
        });
        return { isNewItem: false, cartItem: updated };
      } else {
        // Create new cart item - controller already validated, but fetch product for response
        const created = await tx.cart.create({
          data: { user_id: userId, product_id: productId, quantity: 1 },
          include: {
            product: { include: { category: true } }
          }
        });
        return { isNewItem: true, cartItem: created };
      }
    });
  }

  async getUserCart(userId, page = 1, limit = 10) {
    return await prisma.$transaction(async (tx) => {
      const skip = (page - 1) * limit;

      // First, get all cart items with products
      const allCartItems = await tx.cart.findMany({
        where: { user_id: userId },
        include: { product: true }
      });

      // Find items to remove (inactive or out of stock)
      const itemsToRemove = allCartItems.filter(
        item => !item.product.is_active || item.product.deleted_at || item.product.stock_quantity <= 0
      );

      // Remove unavailable items
      if (itemsToRemove.length > 0) {
        await tx.cart.deleteMany({
          where: {
            id: { in: itemsToRemove.map(item => item.id) }
          }
        });
      }

      // Now fetch the cleaned cart with pagination
      const [cartItems, total] = await Promise.all([
        tx.cart.findMany({
          where: { user_id: userId },
          skip,
          take: limit,
          orderBy: { updated_at: 'desc' },
          include: {
            product: {
              include: {
                category: { select: { id: true, name: true } }
              }
            }
          }
        }),
        tx.cart.count({ where: { user_id: userId } })
      ]);

      return {
        cartItems,
        removedCount: itemsToRemove.length,
        pagination: { total, totalPages: Math.ceil(total / limit), page, limit }
      };
    });
  }

  async updateQuantity(userId, cartId, quantity) {
    return await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cart.findFirst({
        where: { id: cartId, user_id: userId },
        include: { product: true }
      });
      if (!cartItem) throw new ApiError(404, 'Cart item not found');

      // Edge case: Check if product is still active
      if (!cartItem.product.is_active || cartItem.product.deleted_at) {
        await tx.cart.delete({ where: { id: cartId } });
        return { isRemoved: true, reason: 'Product is no longer available' };
      }

      // Edge case: If stock is 0, auto-remove from cart
      if (cartItem.product.stock_quantity <= 0) {
        await tx.cart.delete({ where: { id: cartId } });
        return { isRemoved: true, reason: 'Product is out of stock' };
      }

      if (quantity > cartItem.product.stock_quantity) {
        throw new ApiError(400, `Only ${cartItem.product.stock_quantity} items available`);
      }

      return await tx.cart.update({
        where: { id: cartId },
        data: { quantity },
        include: { product: { include: { category: true } } }
      });
    });
  }

  async removeFromCart(userId, cartId) {
    return await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cart.findFirst({
        where: { id: cartId, user_id: userId }
      });
      if (!cartItem) throw new ApiError(404, 'Cart item not found');

      await tx.cart.delete({ where: { id: cartId } });
      return { success: true };
    });
  }

  async clearCart(userId) {
    return await prisma.$transaction(async (tx) => {
      const result = await tx.cart.deleteMany({ where: { user_id: userId } });
      return { success: true, deletedCount: result.count };
    });
  }

  async getCartCount(userId) {
    const count = await prisma.cart.count({ where: { user_id: userId } });
    return { count };
  }
}

export default new CartService();
