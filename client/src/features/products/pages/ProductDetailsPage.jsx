import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';
import ProductImages from '../components/ProductImages';
import ProductInfo from '../components/ProductInfo';
import ProductTabs from '../components/ProductTabs';
import DeliveryInfoCard from '../components/DeliveryInfoCard';
import { useProductQuery } from '@/hooks/useProductQueries';
import { useCheckFavoriteQuery } from '@/hooks/useFavoriteQueries';
import useAuthStore from '../../../store/useAuthStore';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuthStore();
  const [product, setProduct] = useState(location.state?.product || null);

  const { data: fetchedProduct, isLoading, error } = useProductQuery(id);
  
  // Check favorite status when product is loaded and user is logged in
  useCheckFavoriteQuery(product?.id);

  useEffect(() => {
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    }
  }, [fetchedProduct]);

  // Show loading skeleton
  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="h-[500px] bg-gray-200 animate-pulse rounded-3xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
                <div className="h-12 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-10 bg-gray-200 animate-pulse rounded w-1/4" />
                <div className="h-16 bg-gray-200 animate-pulse rounded w-full mt-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if product not found
  if (!product && error) {
    return (
      <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className="text-xl text-text-muted font-medium">Product not found</p>
          <a href="/products" className="mt-4 inline-block text-primary hover:underline">
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  if (!product) return null;

  // Map API fields to component props
  const productData = {
    id: product.id,
    Name: product.name,
    Category: product.category?.name || 'Solar Products',
    Price: parseFloat(product.price),
    Images: product.images || [],
    Description: product.description || '<p>No description available.</p>',
    Specifications: product.specification || '<p>No specifications available.</p>',
    Included: product.included || '',
    StockStatus: product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
    StockQuantity: product.stock_quantity || 0,
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS */}
        <nav className="flex text-sm font-medium text-gray-500 mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <a href="/products" className="hover:text-blue-600 transition-colors ml-1 md:ml-2">Products</a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="text-gray-900 ml-1 md:ml-2 font-semibold">{productData.Name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* MAIN GRID */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* LEFT SIDE: Images */}
            <div className="lg:pr-8">
              <ProductImages images={productData.Images} />
            </div>

            {/* RIGHT SIDE: Info */}
            <div className="flex flex-col">
              <ProductInfo
                productId={productData.id}
                category={productData.Category}
                name={productData.Name}
                price={productData.Price}
                stockStatus={productData.StockStatus}
                stockQuantity={productData.StockQuantity}
              />
            </div>
          </div>
        </div>

        {/* TABS & DELIVERY INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT TAB CONTENT */}
          <div className="lg:col-span-8">
            <ProductTabs 
              description={productData.Description}
              specifications={productData.Specifications}
              included={productData.Included}
            />
          </div>

          {/* RIGHT INFO CARD */}
          <div className="lg:col-span-4">
            <DeliveryInfoCard />
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;
