import { useEffect, useMemo, useState } from 'react';
import useCategoryStore from '@/store/useCategoryStore';
import CategoryHeader from '../components/CategoryHeader';
import CategoryStatCard from '../components/CategoryStatCard';
import CategoryTable from '../components/CategoryTable';

const CategoriesPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');

    const categories = useCategoryStore((state) => state.categories);
    const pagination = useCategoryStore((state) => state.pagination);
    const isLoading = useCategoryStore((state) => state.isLoading);
    const error = useCategoryStore((state) => state.error);
    const hasFetched = useCategoryStore((state) => state.hasFetched);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    useEffect(() => {
        if (!hasFetched) {
            fetchCategories({ page: currentPage, limit: pagination.limit || 10 });
        }
    }, [currentPage, pagination.limit, hasFetched, fetchCategories]);

    const filteredCategories = useMemo(() => {
        if (statusFilter === 'all') return categories;
        return categories.filter(c => c.status?.toLowerCase() === statusFilter);
    }, [categories, statusFilter]);

    const normalizedCategories = useMemo(() => {
        const toDisplayStatus = (status) => {
            const normalizedStatus = String(status || '').toLowerCase();
            if (normalizedStatus === 'active') return 'Active';
            if (normalizedStatus === 'inactive') return 'Inactive';
            return 'Inactive';
        };

        return filteredCategories.map((category) => ({
            id: category.id,
            name: category.name || 'Unnamed Category',
            status: toDisplayStatus(category.status),
            createdAt: category.created_at,
            updatedAt: category.updated_at,
        }));
    }, [filteredCategories]);

    const categoryStats = useMemo(() => {
        const now = new Date();
        const total = pagination.total || categories.length;
        const active = categories.filter((c) => String(c.status || '').toLowerCase() === 'active').length;
        const inactive = categories.filter((c) => String(c.status || '').toLowerCase() === 'inactive').length;
        const newThisMonth = categories.filter((c) => {
            if (!c.created_at) return false;
            const createdAt = new Date(c.created_at);
            return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
        }).length;

        return {
            total,
            active,
            inactive,
            newThisMonth,
        };
    }, [categories, pagination.total]);

    const handleFilterChange = (filterValue) => {
        setStatusFilter(filterValue);
    };

    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < (pagination.totalPages || 1);

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <CategoryHeader />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CategoryStatCard
                    label="Total Categories"
                    value={categoryStats.total}
                    icon="Folder"
                />
                <CategoryStatCard
                    label="Active Categories"
                    value={categoryStats.active}
                    icon="FolderCheck"
                />
                <CategoryStatCard
                    label="Inactive Categories"
                    value={categoryStats.inactive}
                    icon="FolderOpen"
                />
                <CategoryStatCard
                    label="New This Month"
                    value={categoryStats.newThisMonth}
                    icon="Layers"
                />
            </div>

            {/* Category List Section */}
            <div>
                {isLoading ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-8 px-6 py-8 text-sm font-medium text-slate-500">
                        Loading categories...
                    </div>
                ) : (
                    <>
                        <CategoryTable categories={normalizedCategories} />

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

export default CategoriesPage;
