import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Download, Eye } from 'lucide-react';

const statusConfig = {
  Processing: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    ring: 'ring-blue-200',
  },
  Delivered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
  },
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-400',
    ring: 'ring-amber-200',
  },
};

const avatarColors = [
  'bg-[#1e3a5f]',
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-600',
  'bg-rose-500',
  'bg-amber-500',
];

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' },
  }),
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {status}
    </span>
  );
};

const RecentOrdersTable = ({ orders = [] }) => {
  const [exported, setExported] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const filterOptions = [
    { label: 'By Status', icon: Filter },
    { label: 'By Amount', icon: Filter },
    { label: 'By Customer', icon: Filter },
    { label: 'By Date', icon: Filter },
  ];

  const columns = ['Customer', 'Solar Solution', 'Amount', 'Status', 'Date'];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
          <p className="text-xs text-slate-400 mt-0.5">{orders.length} orders this month</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilterMenuOpen(o => !o)}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${filterMenuOpen
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}
              `}
            >
              <Filter size={14} />
              Filter
            </motion.button>
            <AnimatePresence>
              {filterMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2"
                >
                  <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter By</p>
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setFilterMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1e3a5f] transition-colors"
                    >
                      <opt.icon size={14} className="opacity-60" />
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExport}
            className={`
              flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
              ${exported
                ? 'bg-emerald-500 text-white'
                : 'bg-[#1e3a5f] text-white hover:bg-[#2c5282]'}
            `}
          >
            <Download size={14} />
            {exported ? 'Exported!' : 'Export'}
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3.5 text-left select-none"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {col}
                  </span>
                </th>
              ))}
              <th className="px-6 py-3.5 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Action
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          w-9 h-9 rounded-full flex items-center justify-center
                          text-white text-xs font-bold flex-shrink-0
                          ${avatarColors[i % avatarColors.length]}
                        `}
                      >
                        {order.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{order.customer}</p>
                        <p className="text-xs text-slate-400">{order.location}</p>
                      </div>
                    </div>
                  </td>

                  {/* Solution */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{order.solution}</span>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">
                      ${order.amount.toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{order.date}</span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 transition-colors"
                    >
                      <Eye size={16} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
