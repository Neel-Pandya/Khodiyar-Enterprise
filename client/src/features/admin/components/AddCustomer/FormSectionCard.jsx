import React from 'react';
import { motion } from 'framer-motion';

// Matches the fadeUp pattern used across CustomersPage and CustomerStatCard
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const FormSectionCard = ({ title, icon: Icon, children }) => {
    return (
        <motion.div
            variants={fadeUp}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
            {/* Section Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
                {Icon && (
                    <div className="p-2 bg-[#f0f4f8] rounded-xl">
                        <Icon size={16} className="text-[#1e3a5f]" strokeWidth={2.5} />
                    </div>
                )}
                <h2 className="text-sm md:text-base font-semibold text-[#111827] tracking-tight">
                    {title}
                </h2>
            </div>

            {/* Section Body */}
            <div className="px-6 py-6">
                {children}
            </div>
        </motion.div>
    );
};

export default FormSectionCard;
