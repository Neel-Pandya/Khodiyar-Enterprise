import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const CustomerHeader = () => {
    return (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
                    Customers Management
                </h1>
                <p className="text-gray-500 mt-1 text-sm font-medium">
                    View and manage all your customer information
                </p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#fcd34d] hover:bg-[#fbbf24] text-[#111827] rounded-xl text-sm font-bold transition-all shadow-sm">
                <UserPlus size={18} strokeWidth={2.5} />
                Add New Customer
            </button>
        </motion.div>
    );
};

export default CustomerHeader;
