import { Search } from 'lucide-react';
import CustomerTableRow from './CustomerTableRow';
import FilterButton from '@admin/shared/components/FilterButton';
import ExportButton from '@admin/shared/components/ExportButton';

const CustomerTable = ({ customers }) => {
    const filterOptions = [
        { label: 'By Name' },
        { label: 'By Email' },
        { label: 'By Status' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
            {/* Table Header and Search */}
            <div className="px-6 py-5 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-lg font-semibold text-[#111827]">All Customers</h2>
                    <div className="flex items-center gap-3">
                        <FilterButton options={filterOptions} className="flex-1 sm:flex-none" />
                        <ExportButton onExport={() => console.log('Exporting customers...')} className="flex-1 sm:flex-none" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-[#fbbf24] transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px] table-fixed">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[30%]">Customer</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[40%]">Email Address</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-center w-[15%]">Status</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right w-[15%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {customers.map((customer, i) => (
                            <CustomerTableRow key={customer.id} customer={customer} index={i} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-400">
                    Showing <span className="text-slate-800 font-bold">{customers.length}</span> of <span className="text-slate-800 font-bold">{customers.length}</span> customers
                </p>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors">
                        Previous
                    </button>
                    <button className="w-8 h-8 bg-[#1e293b] text-white rounded-xl text-xs font-bold flex items-center justify-center">
                        1
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerTable;
