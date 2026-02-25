import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

const rowVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' },
    }),
};

const CustomerTableRow = ({ customer, index }) => {
    return (
        <motion.tr
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0"
        >
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {customer.avatar}
                    </div>
                    <p className="font-bold text-[#111827] text-sm">{customer.name}</p>
                </div>
            </td>
            <td className="px-6 py-5">
                <p className="text-sm font-medium text-gray-500">{customer.email}</p>
            </td>
            <td className="px-6 py-5">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block ${customer.status === 'Active' ? 'bg-[#ecfdf5] text-[#059669]' :
                    customer.status === 'Pending' ? 'bg-[#fffbeb] text-[#d97706]' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {customer.status}
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </motion.tr>
    );
};

export default CustomerTableRow;
