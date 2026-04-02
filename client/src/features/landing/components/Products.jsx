import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useProductStore from '../../../store/useProductStore';

const Products = () => {
  const navigate = useNavigate();
  const { products, isLoading, hasFetched, fetchProducts } = useProductStore();

  useEffect(() => {
    if (!hasFetched) {
      fetchProducts({ limit: 8, is_active: true });
    }
  }, [hasFetched, fetchProducts]);

  // Show skeleton cards while loading
  if (isLoading) {
    return (
      <section className="section bg-white text-text-dark">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
            Solar Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-bg-light rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col"
              >
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-6 flex flex-col flex-grow">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-6" />
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show message when no products available
  if (!isLoading && products.length === 0) {
    return (
      <section className="section bg-white text-text-dark">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
            Solar Products
          </h2>
          <div className="text-center py-20">
            <p className="text-xl text-text-muted font-medium">
              No Products Available
            </p>
            <p className="text-text-muted mt-2">
              Check back later for our latest solar products
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-white text-text-dark">
      <div className="container">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
          Solar Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-bg-light rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col group transform-gpu hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={product.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-primary mb-6">{product.name}</h3>
                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/10 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
