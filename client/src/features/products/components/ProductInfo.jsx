import { useNavigate } from 'react-router';
import Button from '@common/Button';
import { ShieldCheck, CreditCard, Zap, Loader2 } from 'lucide-react';
import { useAddToCartMutation } from '@/hooks/useCartQueries';
import useAuthStore from '@/store/useAuthStore';

const ProductInfo = ({ productId, category, name, price, stockStatus, stockQuantity }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCartMutation();
  const isInStock = stockStatus === 'In Stock' && stockQuantity > 0;

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isInStock) return;

    addToCart(productId);
  };

  return (
    <div className="flex flex-col">
      {/* Category Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-md">
          {category}
        </span>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md border ${
          isInStock 
            ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
            : 'text-red-600 bg-red-50 border-red-100'
        }`}>
          <Zap className="w-3 h-3" /> {stockStatus || 'In Stock'}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
        {name}
      </h1>


      {/* Price Section */}
      <div className="mb-10">
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black text-blue-950 tracking-tight">
            ₹{price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full border-t border-gray-100 pt-8 mt-4">
        <div className="flex-1">
          <Button
            variant="primary"
            className="w-full shadow-xl shadow-blue-500/30 rounded-2xl text-lg h-[60px] font-bold tracking-wide hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            onClick={handleAddToCart}
            disabled={!isInStock || isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding...
              </span>
            ) : !isInStock ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">Secure</span>
            <span className="text-xs font-medium text-gray-500">Encrypted Payments</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <CreditCard className="w-8 h-8 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">Flexible</span>
            <span className="text-xs font-medium text-gray-500">Multiple Options</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;