import React, { useState } from 'react';
import { Filter, Search, Download, Eye, MoreHorizontal } from 'lucide-react';
import ExportButton from '@admin/shared/components/ExportButton';
import FilterButton from '@admin/shared/components/FilterButton';
import FormField from '@admin/shared/components/FormField';

const statusConfig = {
    Processing: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        dot: 'bg-blue-500',
        ring: 'ring-blue-200',
    },
    Delivered: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        dot: 'bg-emerald-500',
        ring: 'ring-emerald-200',
    },
    Pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        dot: 'bg-amber-400',
        ring: 'ring-amber-200',
    },
    Canceled: {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        dot: 'bg-rose-500',
        ring: 'ring-rose-200',
    },
};

const avatarColors = [
    'bg-[#1e3a5f]',
    'bg-blue-500',
    'bg-violet-500',
    'bg-emerald-600',
    'bg-rose-500',
    'bg-amber-500',
];

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig.Pending;
    return (
        <span
            className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring}
      `}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            {status}
        </span>
    );
};

const OrdersTable = ({ orders = [], onViewOrder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const columns = ['Order ID', 'Customer', 'Solar Solution', 'Amount', 'Status', 'Date'];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Table Controls */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-50/30">
                <div className="w-full md:w-80">
                    <FormField
                        icon={Search}
                        placeholder="Search by ID, customer or solution..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="!gap-0"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <FilterButton 
                        options={[
                            { label: 'Processing' }, 
                            { label: 'Delivered' }, 
                            { label: 'Pending' }, 
                            { label: 'Canceled' }
                        ]} 
                        onSelect={() => {}}
                    />
                    <ExportButton 
                        onExport={() => {}}
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full min-w-[1000px]">
                    <thead className="bg-slate-50/50">
                        <tr className="border-b border-slate-200">
                            {columns.map((col) => (
                                <th key={col} className="px-6 py-4 text-left select-none">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {col}
                                    </span>
                                </th>
                            ))}
                            <th className="px-6 py-4 text-right">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Actions
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.length > 0 ? (
                            orders.map((order, i) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-slate-50/80 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-[#1e3a5f] font-mono">
                                            #{order.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`
                                                    w-9 h-9 rounded-full flex items-center justify-center
                                                    text-white text-xs font-bold flex-shrink-0
                                                    ${avatarColors[i % avatarColors.length]}
                                                `}
                                            >
                                                {order.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{order.customer}</p>
                                                <p className="text-xs text-slate-400">{order.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600 line-clamp-1 max-w-[200px]">
                                            {order.solution}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-800">
                                            ${order.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-500 whitespace-nowrap">
                                            {order.date}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            <button
                                                onClick={() => onViewOrder(order)}
                                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400 italic">
                                    No orders found matching your search...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
