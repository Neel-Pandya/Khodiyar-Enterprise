import { asyncHandler } from '../handlers/async.handler.js';
import productService from '../services/product.service.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Create a new product
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.files);
  return res
    .status(201)
    .json(new ApiResponse(201, 'Product created successfully', product));
});

/**
 * Get all products with filters
 */
const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Products retrieved successfully', result));
});

/**
 * Get product by ID
 */
const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Product retrieved successfully', product));
});

/**
 * Update product
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.files
  );
  return res
    .status(200)
    .json(new ApiResponse(200, 'Product updated successfully', product));
});

/**
 * Delete product (Soft delete)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Product deleted successfully'));
});

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
