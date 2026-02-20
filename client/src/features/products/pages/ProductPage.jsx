import React from 'react';
import { motion } from 'framer-motion';

// Data & Components
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ProductPage = () => {
  return (
    <div className="min-h-screen pt-0 pb-20 bg-gray-50/50">
      <ProductFilters />

      {/* Product Display Area */}
      <section className="container">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <Pagination />
      </section>
    </div>
  );
};

export default ProductPage;
