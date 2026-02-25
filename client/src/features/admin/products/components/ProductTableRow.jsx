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

const ProductTableRow = ({ product, index }) => {
    return (
        <motion.tr
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0"
        >
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-100"
                    />
                    <p className="font-semibold text-slate-800 text-sm leading-tight">{product.name}</p>
                </div>
            </td>
            <td className="px-6 py-5">
                <p className="text-xs text-slate-700 font-medium">{product.category}</p>
            </td>
            <td className="px-6 py-5">
                <p className="text-sm font-bold text-slate-700 whitespace-nowrap">
                    ₹{product.price.toLocaleString()}
                </p>
            </td>
            <td className="px-6 py-5">
                <p className="text-sm font-semibold text-slate-600">{product.stock}</p>
            </td>
            <td className="px-6 py-5">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ring-1 ${product.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 ring-emerald-100'
                    : product.status === 'Out of Stock'
                        ? 'bg-rose-50 text-rose-600 ring-rose-100'
                        : 'bg-amber-50 text-amber-600 ring-amber-100'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${product.status === 'Active' ? 'bg-emerald-500'
                        : product.status === 'Out of Stock' ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`} />
                    {product.status}
                </span>
            </td>
            <td className="px-3 py-5 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </motion.tr>
    );
};

export default ProductTableRow;
