
// Data & Components
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';

const ProductPage = () => {
  return (
    <div className="min-h-screen pt-0 pb-20 bg-gray-50/50">
      <ProductFilters />

      {/* Product Display Area */}
      <section className="container">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Pagination />
      </section>
    </div>
  );
};

export default ProductPage;
