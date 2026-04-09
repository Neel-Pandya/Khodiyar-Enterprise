import dashboardService from '../services/dashboard.service.js';

const dashboardController = {
  getStats: async (req, res) => {
    const stats = await dashboardService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  },

  getRecentOrders: async (req, res) => {
    const { limit } = req.query;
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const result = await dashboardService.getRecentOrders(parsedLimit);
    res.status(200).json({
      success: true,
      data: result,
    });
  },
};

export default dashboardController;