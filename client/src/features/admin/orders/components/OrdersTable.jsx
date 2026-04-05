import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Filter, Search, Download, Eye, MoreHorizontal } from 'lucide-react';
import ExportButton from '@admin/shared/components/ExportButton';
import FilterButton from '@admin/shared/components/FilterButton';
import FormField from '@admin/shared/components/FormField';
import OrderActionsDropdown from './OrderActionsDropdown';

const orderStatusConfig = {
    pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        dot: 'bg-amber-400',
        ring: 'ring-amber-200',
    },
    confirmed: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        dot: 'bg-blue-500',
        ring: 'ring-blue-200',
    },
    processing: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        dot: 'bg-indigo-500',
        ring: 'ring-indigo-200',
    },
    shipped: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        dot: 'bg-purple-500',
        ring: 'ring-purple-200',
    },
    delivered: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        dot: 'bg-emerald-500',
        ring: 'ring-emerald-200',
    },
    cancelled: {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        dot: 'bg-rose-500',
        ring: 'ring-rose-200',
    },
};

const paymentStatusConfig = {
    pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        dot: 'bg-amber-400',
        ring: 'ring-amber-200',
    },
    completed: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        dot: 'bg-emerald-500',
        ring: 'ring-emerald-200',
    },
    failed: {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        dot: 'bg-rose-500',
        ring: 'ring-rose-200',
    },
    refunded: {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        dot: 'bg-slate-400',
        ring: 'ring-slate-200',
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

const StatusBadge = ({ status, config }) => {
    const cfg = config[status] || config.pending;
    return (
        <span
            className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring}
      `}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            <span className="capitalize">{status}</span>
        </span>
    );
};

const OrdersTable = ({
    orders = [],
    pagination = { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
    onUpdateStatus,
    isUpdating,
    onPageChange,
    onFilterChange,
    activeFilters = {},
}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const columns = ['Order ID', 'Customer', 'Amount', 'Payment Status', 'Order Status', 'Date'];

    // Filter orders by search term (client-side filtering)
    const filteredOrders = orders.filter((order) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            order.id.toLowerCase().includes(search) ||
            order.full_name?.toLowerCase().includes(search) ||
            order.city?.toLowerCase().includes(search) ||
            order.email?.toLowerCase().includes(search)
        );
    });

    const handleViewOrder = (order) => {
        navigate(`/admin/orders/${order.id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Table Controls */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-50/30">
                <div className="w-full md:w-80">
                    <FormField
                        icon={Search}
                        placeholder="Search by ID, customer or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="!gap-0"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <FilterButton 
                        options={[
                            { label: 'All', value: '' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Confirmed', value: 'confirmed' },
                            { label: 'Processing', value: 'processing' },
                            { label: 'Shipped', value: 'shipped' },
                            { label: 'Delivered', value: 'delivered' },
                            { label: 'Cancelled', value: 'cancelled' },
                        ]} 
                        onSelect={(option) => onFilterChange?.('status', option.value)}
                        selectedValue={activeFilters.status}
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
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, i) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-slate-50/80 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-[#1e3a5f] font-mono">
                                            #{order.id.slice(0, 8)}
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
                                                {getInitials(order.full_name)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {order.full_name}
                                                </p>
                                                <p className="text-xs text-slate-400">{order.city}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-800">
                                            ₹{Number(order.total_amount).toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.payment_status} config={paymentStatusConfig} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} config={orderStatusConfig} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-500 whitespace-nowrap">
                                            {formatDate(order.created_at)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <OrderActionsDropdown
                                                order={order}
                                                onUpdateStatus={onUpdateStatus}
                                                isUpdating={isUpdating}
                                            />
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

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-medium text-slate-400">
                    Showing{' '}
                    <span className="text-slate-800 font-bold">
                        {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}
                    </span>{' '}
                    -{' '}
                    <span className="text-slate-800 font-bold">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="text-slate-800 font-bold">{pagination.total}</span> orders
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange?.(pagination.page - 1)}
                        disabled={!pagination.hasPrev}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button className="w-8 h-8 bg-[#1e293b] text-white rounded-xl text-xs font-bold flex items-center justify-center">
                        {pagination.page}
                    </button>
                    <button
                        onClick={() => onPageChange?.(pagination.page + 1)}
                        disabled={!pagination.hasNext}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersTable;
