import StatCard from '../components/StatCard';
import RecentOrdersTable from '../components/RecentOrdersTable';
import { useDashboardStats, useRecentOrders } from '@/hooks/useDashboardQueries';

const DashboardPage = () => {
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: recentOrdersData, isLoading: ordersLoading, isError: ordersError } = useRecentOrders(10);

  const transformStats = (stats) => {
    if (!stats) return [];
    return [
      {
        id: 1,
        label: 'Total Solutions Delivered',
        value: stats.totalSolutionsDelivered,
        prefix: '',
        suffix: '',
        trend: stats.trends?.solutions || 0,
        icon: 'Sun',
        iconColor: '#1e3a5f',
      },
      {
        id: 2,
        label: 'Active Orders',
        value: stats.activeOrders,
        prefix: '',
        suffix: '',
        trend: stats.trends?.orders || 0,
        icon: 'Zap',
        iconColor: '#3b82f6',
      },
      {
        id: 3,
        label: 'Total Customers',
        value: stats.totalCustomers,
        prefix: '',
        suffix: '',
        trend: stats.trends?.customers || 0,
        icon: 'Users',
        iconColor: '#8b5cf6',
      },
      {
        id: 4,
        label: 'Monthly Revenue',
        value: stats.monthlyRevenue,
        prefix: '₹',
        // suffix: 'K',
        trend: stats.trends?.revenue || 0,
        icon: 'DollarSign',
        iconColor: '#fbc02d',
      },
    ];
  };

  const stats = statsData ? transformStats(statsData) : [];
  const orders = recentOrdersData?.orders || [];

  if (statsLoading || ordersLoading) {
    return (
      <div className="space-y-8 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage your solar solutions business efficiently
          </p>
        </div>
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fbc02d]"></div>
        </div>
      </div>
    );
  }

  if (statsError || ordersError) {
    return (
      <div className="space-y-8 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage your solar solutions business efficiently
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <p className="text-red-500 font-medium">
            Error loading dashboard data. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#1e3a5f] hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Manage your solar solutions business efficiently
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>

      {/* Recent Orders Table */}
      <div>
        <RecentOrdersTable orders={orders} />
      </div>
    </div>
  );
};

export default DashboardPage;
