import React from 'react';
import { motion } from 'framer-motion';
import { productStats, productsList } from '../../data/mockData';
import ProductHeader from '../components/ProductHeader';
import ProductStatCard from '../components/ProductStatCard';
import ProductTable from '../components/ProductTable';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const ProductsPage = () => {
    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <ProductHeader />

            {/* Stats Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {productStats.map((stat, i) => (
                    <ProductStatCard
                        key={stat.id}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                    />
                ))}
            </motion.div>

            {/* Product List Section */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <ProductTable products={productsList} />
            </motion.div>
        </div>
    );
};

export default ProductsPage;
