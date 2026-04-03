import { useNavigate } from 'react-router';
import Button from '@common/Button';
import { Heart, ShieldCheck, CreditCard, Zap } from 'lucide-react';
import useFavoriteStore from '@/store/useFavoriteStore';
import { useToggleFavoriteMutation } from '@/hooks/useFavoriteQueries';
import useAuthStore from '@/store/useAuthStore';

const ProductInfo = ({ productId, category, name, price, stockStatus, isFavorite: initialIsFavorite = false }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { optimisticToggle, completeToggle, rollbackToggle, isFavorite, isToggling } = useFavoriteStore();
  const { mutateAsync: toggleFavoriteApi } = useToggleFavoriteMutation();
  const isInStock = stockStatus === 'In Stock';

  const handleFavoriteClick = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!productId || isToggling(productId)) return;

    // Optimistic update
    const previousState = optimisticToggle(productId);
    if (!previousState) return; // Already toggling

    try {
      const result = await toggleFavoriteApi(productId);
      // Complete the toggle with server result
      completeToggle(productId, result.isFavorite, { id: productId, name, price, category: { name: category } });
    } catch (error) {
      // Rollback on error
      rollbackToggle(productId, previousState.wasFavorited);
      console.error('Failed to toggle favorite:', error);
    }
  };

  // Get current favorite state from store (for optimistic updates)
  const currentIsFavorite = productId ? isFavorite(productId) : initialIsFavorite;
  const isLoading = productId ? isToggling(productId) : false;

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
            className="w-full shadow-xl shadow-blue-500/30 rounded-2xl text-lg h-[60px] font-bold tracking-wide hover:-translate-y-0.5 transition-transform"
            onClick={() => navigate('/cart')}
          >
            Add to Cart
          </Button>
        </div>
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`group h-[60px] w-full sm:w-[72px] flex items-center justify-center bg-white border-2 rounded-2xl transition-all cursor-pointer shadow-sm disabled:opacity-50 ${
            currentIsFavorite
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 hover:border-red-500 hover:bg-red-50'
          }`}
          title={currentIsFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-7 h-7 transition-all ${
              currentIsFavorite
                ? 'text-red-500 fill-red-500'
                : 'text-gray-400 group-hover:text-red-500 group-hover:fill-red-500'
            }`}
          />
        </button>
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
