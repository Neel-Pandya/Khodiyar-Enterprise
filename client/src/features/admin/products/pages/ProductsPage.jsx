import { productStats, productsList } from '@data/adminMockData';
import ProductHeader from '../components/ProductHeader';
import ProductStatCard from '../components/ProductStatCard';
import ProductTable from '../components/ProductTable';

const ProductsPage = () => {
    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <ProductHeader />

            {/* Stats Grid */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {productStats.map((stat) => (
                    <ProductStatCard
                        key={stat.id}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                    />
                ))}
            </div>

            {/* Product List Section */}
            <div>
                <ProductTable products={productsList} />
            </div>
        </div>
    );
};

export default ProductsPage;
