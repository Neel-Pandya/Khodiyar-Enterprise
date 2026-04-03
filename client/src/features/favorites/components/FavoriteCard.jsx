import { Trash2, ShoppingCart, AlertCircle } from 'lucide-react';
import Button from '@common/Button';

const FavoriteCardImage = ({ src, alt, category, isActive }) => (
  <div className="h-48 sm:h-64 overflow-hidden relative">
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isActive ? 'grayscale' : ''}`}
    />
    {category && (
      <div className="absolute top-4 left-4">
        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#1e3a5f] shadow-sm">
          {category}
        </span>
      </div>
    )}
    {!isActive && (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Unavailable</span>
        </div>
      </div>
    )}
  </div>
);

const FavoriteCardContent = ({ name, description, price, onRemove, onAddToCart, isActive }) => (
  <div className="p-6 sm:p-8 flex flex-col flex-grow bg-white">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1 min-w-0">
        <h3 className={`text-xl font-black transition-colors line-clamp-1 ${isActive ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>
          {name}
        </h3>
        {price && (
          <p className={`text-lg font-bold mt-1 ${isActive ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>
            ₹{typeof price === 'number' ? price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : price}
          </p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all ml-2 flex-shrink-0"
        title="Remove from favorites"
      >
        <Trash2 size={18} />
      </button>
    </div>
  
    <div className="mt-auto">
      {isActive ? (
        <Button
          variant="primary"
          onClick={onAddToCart}
          className="flex items-center justify-center gap-2 group/btn w-full"
        >
          <ShoppingCart size={18} className="transition-transform group-hover/btn:-translate-y-0.5" />
          Add to Cart
        </Button>
      ) : (
        <Button
          variant="secondary"
          disabled
          className="w-full cursor-not-allowed opacity-60"
          title="Product is no longer available"
        >
          <AlertCircle size={18} className="mr-2" />
          Unavailable
        </Button>
      )}
    </div>
  </div>
);

const FavoriteCard = ({ product, onRemove, onAddToCart }) => {
  const isActive = product.is_active !== false;

  // Handle both old mock data structure and new API data structure
  const image = product.images?.[0] || product.image || '/placeholder-product.jpg';
  const category = product.category?.name || product.category;
  const price = product.price ? parseFloat(product.price) : null;

  return (
    <div
      className={`bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col group transition-all duration-300 h-full ${isActive ? 'hover:-translate-y-2' : 'opacity-75'}`}
    >
      <FavoriteCardImage
        src={image}
        alt={product.name}
        category={category}
        isActive={isActive}
      />
      <FavoriteCardContent
        name={product.name}
        description={product.description || 'No description available'}
        price={price}
        onRemove={() => onRemove(product.id)}
        onAddToCart={() => onAddToCart(product)}
        isActive={isActive}
      />
    </div>
  );
};

export default FavoriteCard;
