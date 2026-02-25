import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';

const FilterButton = ({ options = [], className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300
          ${isOpen
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'border border-gray-100 text-gray-600 hover:bg-slate-50'}
        `}
            >
                <Filter size={14} strokeWidth={2.5} />
                Filter
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20"
                        >
                            <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter By</p>
                            {options.map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1e3a5f] transition-colors"
                                >
                                    <Filter size={14} className="opacity-60" />
                                    {opt.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterButton;
