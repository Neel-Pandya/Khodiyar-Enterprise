
import { useEffect, useState, useCallback } from 'react';
import useProductStore from '../../../store/useProductStore';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';

const ProductPage = () => {
  const { products, pagination, isLoading, fetchProducts } = useProductStore();
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const loadProducts = useCallback(() => {
    const params = {
      page: pagination.page,
      limit: 12,
      is_active: true,
      ...filters,
    };
    fetchProducts(params);
  }, [pagination.page, filters, fetchProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handlePageChange = (page) => {
    fetchProducts({
      page,
      limit: 12,
      is_active: true,
      ...filters,
    });
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchProducts({
      page: 1,
      limit: 12,
      is_active: true,
      ...newFilters,
    });
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      category_id: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    fetchProducts({
      page: 1,
      limit: 12,
      is_active: true,
      ...resetFilters,
    });
  };
  return (
    <div className="min-h-screen pt-0 pb-20 bg-gray-50/50">
      <ProductFilters
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Product Display Area */}
      <section className="container">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
              >
                <div className="h-64 bg-gray-200 animate-pulse" />
                <div className="p-8 flex flex-col flex-grow">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-6" />
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-text-muted font-medium">
              {filters.search || filters.category_id ? 'No Products matched' : 'No Products Available'}
            </p>
            <p className="text-text-muted mt-2">
              {filters.search || filters.category_id
                ? 'Try adjusting your filters to see more results'
                : 'Check back later for our latest solar products'}
            </p>
            {(filters.search || filters.category_id) && (
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default ProductPage;
