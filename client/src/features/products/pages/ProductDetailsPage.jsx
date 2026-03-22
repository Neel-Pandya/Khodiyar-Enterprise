import { useParams } from 'react-router';
import ProductImages from '../components/ProductImages';
import ProductInfo from '../components/ProductInfo';
import ProductTabs from '../components/ProductTabs';
import DeliveryInfoCard from '../components/DeliveryInfoCard';
import { MOCK_PRODUCT } from '@data/mockProduct';

const ProductDetailsPage = () => {
  const { id } = useParams();

  // Using imported mock data (can be replaced with fetch logic later)
  const product = MOCK_PRODUCT;

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
                <span className="text-gray-900 ml-1 md:ml-2 font-semibold">{product.Name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* MAIN GRID */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* LEFT SIDE: Images */}
            <div className="lg:pr-8">
              <ProductImages images={product.Images} />
            </div>

            {/* RIGHT SIDE: Info */}
            <div className="flex flex-col">
              <ProductInfo 
                category={product.Category}
                name={product.Name}
                price={product.Price}
              />
            </div>
          </div>
        </div>

        {/* TABS & DELIVERY INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT TAB CONTENT */}
          <div className="lg:col-span-8">
            <ProductTabs 
              description={product.Description}
              specifications={product.Specifications}
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
