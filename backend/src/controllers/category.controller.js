import { asyncHandler } from '../handlers/async.handler.js';
import categoryService from '../services/category.service.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Create a new category
 */
const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, 'Category created successfully', category));
});

/**
 * Get all categories
 */
const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Categories retrieved successfully', result));
});

/**
 * Get category by ID
 */
const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Category retrieved successfully', category));
});

/**
 * Update category
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  return res
    .status(200)
    .json(new ApiResponse(200, 'Category updated successfully', category));
});

/**
 * Delete category (Soft delete)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Category deleted (inactive) successfully'));
});

export default {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
