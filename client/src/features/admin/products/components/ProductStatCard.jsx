import React from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';

const iconMap = {
    Package: { icon: Package, color: 'text-[#1e3a5f]', bg: 'bg-[#1e3a5f]/5' },
    CheckCircle: { icon: CheckCircle, color: 'text-[#10b981]', bg: 'bg-[#10b981]/5' },
    AlertTriangle: { icon: AlertTriangle, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/5' },
    CreditCard: { icon: CreditCard, color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/5' },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const ProductStatCard = ({ label, value, icon, prefix = '', suffix = '' }) => {
    const meta = iconMap[icon] || iconMap.Package;
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
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    {label}
                </p>
                <p className="text-2xl font-bold text-[#111827]">
                    {prefix}{value.toLocaleString()}{suffix}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductStatCard;
