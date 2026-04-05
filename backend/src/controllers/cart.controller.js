import cartService from '../services/cart.service.js';
import ApiError from '../utils/ApiError.js';
import prisma from '../db/prisma.js';

const cartController = {
  /**
   * Add item to cart
   * POST /api/cart
   */
  addToCart: async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    // STOCK VALIDATION in controller (before service call)
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock_quantity: true, is_active: true, deleted_at: true, name: true }
    });

    if (!product || !product.is_active || product.deleted_at) {
      throw new ApiError(404, 'Product not found');
    }

    if (product.stock_quantity <= 0) {
      throw new ApiError(400, 'Product is out of stock');
    }

    const result = await cartService.addToCart(userId, productId);

    // Handle case where item was auto-removed due to inactive product or out of stock
    if (result.isRemoved) {
      return res.status(400).json({
        success: false,
        message: `${result.reason} and has been removed from your cart`,
        data: { isRemoved: true }
      });
    }

    const { isNewItem, cartItem } = result;

    res.status(200).json({
      success: true,
      message: isNewItem ? 'Item added to cart' : 'Quantity updated',
      data: { isNewItem, cartItem }
    });
  },

  /**
   * Get user's cart
   * GET /api/cart
   */
  getCart: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await cartService.getUserCart(req.user.id, page, limit);
    res.status(200).json({ success: true, data: result });
  },

  /**
   * Update cart item quantity
   * PATCH /api/cart/:cartId
   */
  updateQuantity: async (req, res) => {
    const { cartId } = req.params;
    const { quantity } = req.body;

    const result = await cartService.updateQuantity(req.user.id, cartId, quantity);

    // Handle case where item was auto-removed due to inactive product or out of stock
    if (result.isRemoved) {
      return res.status(400).json({
        success: false,
        message: `${result.reason} and has been removed from your cart`,
        data: { isRemoved: true }
      });
    }

    res.status(200).json({ success: true, message: 'Quantity updated', data: result });
  },

  /**
   * Remove item from cart
   * DELETE /api/cart/:cartId
   */
  removeItem: async (req, res) => {
    const { cartId } = req.params;
    await cartService.removeFromCart(req.user.id, cartId);
    res.status(200).json({ success: true, message: 'Item removed' });
  },

  /**
   * Clear user's cart
   * DELETE /api/cart
   */
  clearCart: async (req, res) => {
    await cartService.clearCart(req.user.id);
    res.status(200).json({ success: true, message: 'Cart cleared' });
  },

  /**
   * Get cart count
   * GET /api/cart/count
   */
  getCartCount: async (req, res) => {
    const { count } = await cartService.getCartCount(req.user.id);
    res.status(200).json({ success: true, data: { count } });
  }
};

export default cartController;
