import { asyncHandler } from '../handlers/async.handler.js';
import dashboardService from '../services/dashboard.service.js';
import ApiResponse from '../utils/ApiResponse.js';

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  return res
    .status(200)
    .json(
      new ApiResponse(200, 'Dashboard stats retrieved successfully', stats)
    );
});

const getRecentOrders = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const parsedLimit = limit ? parseInt(limit, 10) : 10;
  const result = await dashboardService.getRecentOrders(parsedLimit);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Recent orders retrieved successfully', result));
});

export default { getStats, getRecentOrders };
