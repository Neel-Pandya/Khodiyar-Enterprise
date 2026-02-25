import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserPlus, DollarSign } from 'lucide-react';

const iconMap = {
    Users: { icon: Users, color: 'text-[#1e3a5f]', bg: 'bg-[#f0f4f8]' },
    UserCheck: { icon: UserCheck, color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
    UserPlus: { icon: UserPlus, color: 'text-[#d97706]', bg: 'bg-[#fffbeb]' },
    DollarSign: { icon: DollarSign, color: 'text-[#7c3aed]', bg: 'bg-[#f5f3ff]' },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const CustomerStatCard = ({ label, value, icon, prefix = '' }) => {
    const meta = iconMap[icon] || iconMap.Users;
    const Icon = meta.icon;

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow duration-300 cursor-default select-none"
        >
            <div className={`p-3 rounded-xl w-fit ${meta.bg}`}>
                <Icon size={24} className={meta.color} strokeWidth={2} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {label}
                </p>
                <p className="text-2xl font-black text-[#111827]">
                    {prefix}{value.toLocaleString()}{icon === 'DollarSign' ? 'K' : ''}
                </p>
            </div>
        </motion.div>
    );
};

export default CustomerStatCard;
