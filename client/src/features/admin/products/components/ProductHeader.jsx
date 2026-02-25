import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ProductHeader = () => {
    const navigate = useNavigate();

    return (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
                    Products Management
                </h1>
                <p className="text-gray-500 mt-1 text-sm font-medium">
                    View and manage all your solar product inventory
                </p>
            </div>
            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/admin/products/add')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#fbc02d] hover:bg-[#fbbf24] text-[#1e3a5f] rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm shadow-[#fbc02d]/20"
            >
                <Plus size={18} strokeWidth={2.5} />
                Add New Product
            </motion.button>
        </motion.div>
    );
};

export default ProductHeader;
