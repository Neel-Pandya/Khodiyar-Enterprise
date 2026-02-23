import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Zap, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const iconMap = {
  Sun,
  Zap,
  Users,
  DollarSign,
};



const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const StatCard = ({ stat, index }) => {
  const Icon = iconMap[stat.icon] || DollarSign;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default select-none"
    >
      {/* Icon */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 w-fit mb-4">
        <Icon size={22} color={stat.iconColor || '#1e3a5f'} strokeWidth={2.5} />
      </div>

      {/* Label */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
        {stat.label}
      </p>

      {/* Value */}
      <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
        {stat.prefix}
        {stat.value.toLocaleString()}
        {stat.suffix}
      </p>
    </motion.div>
  );
};

export default StatCard;
