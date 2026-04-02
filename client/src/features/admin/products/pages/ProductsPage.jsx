import { useEffect } from 'react';
import ProductHeader from '../components/ProductHeader';
import ProductStatCard from '../components/ProductStatCard';
import ProductTable from '../components/ProductTable';
import useProductStore from '@/store/useProductStore';

const ProductsPage = () => {
    const { products, pagination, fetchProducts, isLoading } = useProductStore();

    useEffect(() => {
        fetchProducts({ limit: 10 });
    }, [fetchProducts]);

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
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#fbc02d]"></div>
                    </div>
                ) : (
                    <ProductTable products={products} />
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
