import React, { useState } from 'react';
import OrdersTable from '../components/OrdersTable';
import OrderStatCard from '../components/OrderStatCard';
import { useAdminOrdersQuery, useUpdateOrderStatusMutation } from '@/hooks/useAdminOrderQueries';
import * as toast from '@/utils/toast';

const OrdersPage = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});

    const { data, isLoading, isError, error } = useAdminOrdersQuery({
        page,
        limit: 10,
        ...filters,
    });

    const updateStatusMutation = useUpdateOrderStatusMutation();

    const handleUpdateStatus = async ({ orderId, data }) => {
        try {
            await updateStatusMutation.mutateAsync({ orderId, data });
            toast.success('Status updated successfully');
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to update status';
            toast.error(message);
            throw err;
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const calculateStats = () => {
        const orders = data?.orders || [];
        const total = data?.pagination?.total || 0;
        const pending = orders.filter((o) => o.status === 'pending').length;
        const completed = orders.filter((o) => o.status === 'delivered').length;
        const cancelled = orders.filter((o) => o.status === 'cancelled').length;

        return [
            { id: 'total', label: 'Total Orders', value: total, icon: 'ClipboardList' },
            { id: 'pending', label: 'Pending Orders', value: pending, icon: 'Clock' },
            { id: 'completed', label: 'Completed Orders', value: completed, icon: 'CheckCircle' },
            { id: 'cancelled', label: 'Canceled Orders', value: cancelled, icon: 'XCircle' },
        ];
    };

    const orderStats = calculateStats();
    const orders = data?.orders || [];
    const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false };

    if (isLoading) {
        return (
            <div className="space-y-8 max-w-[1400px] mx-auto">
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fbc02d]"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8 max-w-[1400px] mx-auto">
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                    <p className="text-red-500 font-medium">
                        Error loading orders: {error?.message || 'Unknown error'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-[#1e3a5f] hover:underline"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        Orders Management
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">
                        Track and manage customer orders
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {orderStats.map((stat) => (
                    <OrderStatCard 
                        key={stat.id} 
                        label={stat.label} 
                        value={stat.value} 
                        icon={stat.icon} 
                    />
                ))}
            </div>

            {/* Main Table Section */}
            <div className="relative">
                <OrdersTable
                    orders={orders}
                    pagination={pagination}
                    onUpdateStatus={handleUpdateStatus}
                    isUpdating={updateStatusMutation.isPending}
                    onPageChange={handlePageChange}
                    onFilterChange={handleFilterChange}
                    activeFilters={filters}
                />
            </div>
        </div>
    );
};

export default OrdersPage;
