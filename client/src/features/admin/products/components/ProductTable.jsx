import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import ProductTableRow from './ProductTableRow';
import FilterButton from '../../shared/components/FilterButton';
import ExportButton from '../../shared/components/ExportButton';

const ProductTable = ({ products }) => {
    const filterOptions = [
        { label: 'By Name' },
        { label: 'By Category' },
        { label: 'By Status' },
        { label: 'Low Stock' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
            {/* Table Header */}
            <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-lg font-bold text-[#111827]">All Products</h2>
                    <div className="flex items-center gap-3">
                        <FilterButton options={filterOptions} className="flex-1 sm:flex-none" />
                        <ExportButton onExport={() => console.log('Exporting products...')} className="flex-1 sm:flex-none" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-[#fbbf24] transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full text-left min-w-[800px] table-fixed">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[30%]">Product</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[20%]">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[15%]">Price</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[10%]">Stock</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[15%]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {products.map((product, i) => (
                                    <ProductTableRow key={product.id} product={product} index={i} />
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
                    <p className="text-xs font-medium text-slate-400">
                        Showing <span className="text-slate-800 font-bold">{products.length}</span> of <span className="text-slate-800 font-bold">{products.length}</span> products
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors">
                            Previous
                        </button>
                        <button className="w-8 h-8 bg-[#1e293b] text-white rounded-xl text-xs font-bold flex items-center justify-center">
                            1
                        </button>
                        <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;
