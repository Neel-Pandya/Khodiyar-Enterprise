import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import CustomerTableRow from './CustomerTableRow';
import FilterButton from './FilterButton';
import ExportButton from './ExportButton';

const CustomerTable = ({ customers }) => {
    const filterOptions = [
        { label: 'By Name' },
        { label: 'By Email' },
        { label: 'By Status' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8">
            {/* Table Header */}
            <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-lg font-extrabold text-[#111827]">All Customers</h2>
                    <div className="flex items-center gap-3">
                        <FilterButton options={filterOptions} className="flex-1 sm:flex-none" />
                        <ExportButton onExport={() => console.log('Exporting customers...')} className="flex-1 sm:flex-none" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-[#fbbf24] transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Email Address</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {customers.map((customer, i) => (
                                    <CustomerTableRow key={customer.id} customer={customer} index={i} />
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6">
                    <p className="text-xs font-medium text-gray-400">
                        Showing <span className="text-[#111827] font-bold">{customers.length}</span> of <span className="text-[#111827] font-bold">{customers.length}</span> customers
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors">
                            Previous
                        </button>
                        <button className="w-8 h-8 bg-[#1e293b] text-white rounded-xl text-xs font-bold flex items-center justify-center">
                            1
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerTable;
