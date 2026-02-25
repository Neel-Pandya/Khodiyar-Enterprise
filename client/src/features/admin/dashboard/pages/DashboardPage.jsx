import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import RecentOrdersTable from '../components/RecentOrdersTable';
import { statsData, recentOrders } from '../../data/mockData';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const DashboardPage = () => {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Manage your solar solutions business efficiently
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsData.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </motion.div>


      {/* Recent Orders Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
        <RecentOrdersTable orders={recentOrders} />
      </motion.div>
    </div>
  );
};

export default DashboardPage;
