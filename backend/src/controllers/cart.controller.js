import { asyncHandler } from '../handlers/async.handler.js';
import cartService from '../services/cart.service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import prisma from '../db/prisma.js';

/**
 * Add item to cart
 * POST /api/cart
 */
const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  // STOCK VALIDATION in controller (before service call)
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      stock_quantity: true,
      is_active: true,
      deleted_at: true,
      name: true,
    },
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
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          `${result.reason} and has been removed from your cart`,
          { isRemoved: true }
        )
      );
  }

  const { isNewItem, cartItem } = result;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        isNewItem ? 'Item added to cart' : 'Quantity updated',
        { isNewItem, cartItem }
      )
    );
});

/**
 * Get user's cart
 * GET /api/cart
 */
const getCart = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await cartService.getUserCart(req.user.id, page, limit);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Cart retrieved successfully', result));
});

/**
 * Update cart item quantity
 * PATCH /api/cart/:cartId
 */
const updateQuantity = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  const result = await cartService.updateQuantity(
    req.user.id,
    cartId,
    quantity
  );

  // Handle case where item was auto-removed due to inactive product or out of stock
  if (result.isRemoved) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          `${result.reason} and has been removed from your cart`,
          { isRemoved: true }
        )
      );
  }

  return res.status(200).json(new ApiResponse(200, 'Quantity updated', result));
});

/**
 * Remove item from cart
 * DELETE /api/cart/:cartId
 */
const removeItem = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  await cartService.removeFromCart(req.user.id, cartId);
  return res.status(200).json(new ApiResponse(200, 'Item removed'));
});

/**
 * Clear user's cart
 * DELETE /api/cart
 */
const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user.id);
  return res.status(200).json(new ApiResponse(200, 'Cart cleared'));
});

/**
 * Get cart count
 * GET /api/cart/count
 */
const getCartCount = asyncHandler(async (req, res) => {
  const { count } = await cartService.getCartCount(req.user.id);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Cart count retrieved successfully', { count }));
});

export default {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
  getCartCount,
};
