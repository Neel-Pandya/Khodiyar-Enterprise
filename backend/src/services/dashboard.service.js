import prisma from '../db/prisma.js';

class DashboardService {
  async getStats() {
    const [
      deliveredOrders,
      activeOrders,
      totalCustomers,
      completedOrdersThisMonth,
    ] = await Promise.all([
      prisma.order.count({ where: { status: 'delivered' } }),
      prisma.order.count({
        where: {
          status: { in: ['pending', 'confirmed', 'processing', 'shipped'] },
        },
      }),
      prisma.user.count({ where: { role: 'user' } }),
      prisma.order.aggregate({
        where: {
          payment_status: 'completed',
          created_at: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { total_amount: true },
      }),
    ]);

    const monthlyRevenue = completedOrdersThisMonth._sum.total_amount
      ? Number(completedOrdersThisMonth._sum.total_amount)
      : 0;

    return {
      totalSolutionsDelivered: deliveredOrders,
      activeOrders,
      totalCustomers,
      monthlyRevenue,
      trends: {
        solutions: 12.5,
        orders: 8.2,
        customers: 5.1,
        revenue: 18.3,
      },
    };
  }

  async getRecentOrders(limit = 10) {
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
        order_items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    });

    return {
      orders: orders.map((order) => {
        const firstItem = order.order_items[0];
        const initials = order.full_name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        return {
          id: order.id,
          customer: order.user.name,
          avatar: order.user.avatar || initials,
          location: `${order.city}, ${order.state}`,
          solution: firstItem?.product?.name || 'N/A',
          amount: Number(order.total_amount),
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          date: order.created_at.toISOString().split('T')[0],
          email: order.email,
          phone: order.phone,
        };
      }),
    };
  }
}

export default new DashboardService();