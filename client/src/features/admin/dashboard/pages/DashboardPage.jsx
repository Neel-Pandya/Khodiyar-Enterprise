import React from 'react';
import StatCard from '../components/StatCard';
import RecentOrdersTable from '../components/RecentOrdersTable';
import { statsData, recentOrders } from '../../data/mockData';

const DashboardPage = () => {
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
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
      >
        {statsData.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>


      {/* Recent Orders Table */}
      <div>
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
};

export default DashboardPage;
