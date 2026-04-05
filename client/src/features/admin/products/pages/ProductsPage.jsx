import { useState } from 'react';
import ProductHeader from '../components/ProductHeader';
import ProductStatCard from '../components/ProductStatCard';
import ProductTable from '../components/ProductTable';
import { useProductsQuery } from '@/hooks/useProductQueries';
import useProductStore from '@/store/useProductStore';

const ProductsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isActiveFilter, setIsActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { products, pagination } = useProductStore();
    const { isLoading, error } = useProductsQuery({
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter,
        is_active: isActiveFilter === 'all' ? undefined : isActiveFilter,
        search: searchQuery || undefined,
    });

    // Handle filter changes and reset to page 1
    const handleFilterChange = (updates) => {
        if (updates.status !== undefined) {
            setStatusFilter(updates.status || 'all');
        }
        if (updates.isActive !== undefined) {
            setIsActiveFilter(updates.isActive || 'all');
        }
        if (updates.search !== undefined) {
            setSearchQuery(updates.search || '');
        }
        setCurrentPage(1);
    };

    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < (pagination.totalPages || 1);

    // Calculate stats from real data
    const totalProducts = pagination.total;
    const availableProducts = products.filter(p => p.status === 'available').length;
    const outOfStock = products.filter(p => p.status === 'out_of_stock').length;

    const productStats = [
        { id: 1, label: 'Total Products', value: totalProducts, icon: 'Package' },
        { id: 2, label: 'Available', value: availableProducts, icon: 'CheckCircle' },
        { id: 3, label: 'Out of Stock', value: outOfStock, icon: 'XCircle' },
        { id: 4, label: 'Categories', value: new Set(products.map(p => p.category_id)).size, icon: 'TrendingUp' },
    ];

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <ProductHeader />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {productStats.map((stat) => (
                    <ProductStatCard
                        key={stat.id}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* Product List Section */}
            <div>
                <ProductTable
                    products={products}
                    status={statusFilter}
                    isActive={isActiveFilter}
                    search={searchQuery}
                    onFilterChange={handleFilterChange}
                    isLoading={isLoading}
                />

                {!isLoading && (pagination.totalPages || 1) > 1 && (
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
            </div>
        </div>
    );
};

export default ProductsPage;
