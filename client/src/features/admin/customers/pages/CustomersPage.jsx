import { useMemo, useState } from 'react';
import useCustomerStore from '@/store/useCustomerStore';
import { useCustomersQuery } from '@/hooks/useCustomerQueries';
import CustomerHeader from '../components/CustomerHeader';
import CustomerStatCard from '../components/CustomerStatCard';
import CustomerTable from '../components/CustomerTable';

const CustomersPage = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const { customers, pagination } = useCustomerStore();
    const { isLoading, error } = useCustomersQuery({ page: currentPage, limit: 10 });

    const normalizedCustomers = useMemo(() => {
        const toDisplayStatus = (status) => {
            const normalizedStatus = String(status || '').toLowerCase();

            if (normalizedStatus === 'active') return 'Active';
            if (normalizedStatus === 'inactive') return 'Inactive';
            if (normalizedStatus === 'suspended') return 'Suspended';
            return 'Unknown';
        };

        const getAvatar = (customer) => {
            if (customer.avatar) return customer.avatar;
            const base = customer.name || customer.email || '';
            const parts = base.trim().split(' ').filter(Boolean);
            if (parts.length >= 2) {
                return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
            }
            return (base.slice(0, 2) || 'NA').toUpperCase();
        };

        return customers.map((customer) => ({
            id: customer.id,
            name: customer.name || 'Unknown User',
            email: customer.email || 'No email',
            status: toDisplayStatus(customer.status),
            avatar: getAvatar(customer),
        }));
    }, [customers]);

    const customerStats = useMemo(() => {
        const now = new Date();
        const active = customers.filter((customer) => String(customer.status || '').toLowerCase() === 'active').length;
        const newThisMonth = customers.filter((customer) => {
            if (!customer.created_at) return false;
            const createdAt = new Date(customer.created_at);
            return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
        }).length;

        const totalRevenue = customers.reduce((sum, customer) => {
            return sum + Number(customer.totalRevenue ?? customer.total_revenue ?? customer.totalSpent ?? 0);
        }, 0);

        return {
            total: pagination.total || customers.length,
            active,
            newThisMonth,
            totalRevenue,
        };
    }, [customers, pagination.total]);

    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < (pagination.totalPages || 1);

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <CustomerHeader />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <CustomerStatCard
                    label="Total Customers"
                    value={customerStats.total}
                    icon="Users"
                />
                <CustomerStatCard
                    label="Active Customers"
                    value={customerStats.active}
                    icon="UserCheck"
                />
                <CustomerStatCard
                    label="New This Month"
                    value={customerStats.newThisMonth}
                    icon="UserPlus"
                />
                <CustomerStatCard
                    label="Total Revenue"
                    value={customerStats.totalRevenue / 1000}
                    icon="DollarSign"
                    prefix="$"
                />
            </div>

            {/* Customer List Section */}
            <div>
                {isLoading ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-8 px-6 py-8 text-sm font-medium text-slate-500">
                        Loading customers...
                    </div>
                ) : (
                    <>
                        <CustomerTable customers={normalizedCustomers} />

                        {(pagination.totalPages || 1) > 1 && (
                            <div className="mt-4 px-1 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs font-medium text-slate-400">
                                    Page <span className="text-slate-800 font-bold">{pagination.page || currentPage}</span> of <span className="text-slate-800 font-bold">{pagination.totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => canGoPrev && setCurrentPage((prev) => prev - 1)}
                                        disabled={!canGoPrev}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => canGoNext && setCurrentPage((prev) => prev + 1)}
                                        disabled={!canGoNext}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomersPage;
