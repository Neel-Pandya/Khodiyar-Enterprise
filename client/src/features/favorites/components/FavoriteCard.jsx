import { Trash2, ShoppingCart } from 'lucide-react';
import Button from '@common/Button';

const FavoriteCardImage = ({ src, alt, category }) => (
  <div className="h-48 sm:h-64 overflow-hidden relative">
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    {category && (
      <div className="absolute top-4 left-4">
        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#1e3a5f] shadow-sm">
          {category}
        </span>
      </div>
    )}
  </div>
);

const FavoriteCardContent = ({ name, description, category, onRemove, onAddToCart }) => (
  <div className="p-6 sm:p-8 flex flex-col flex-grow bg-white">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-black text-[#1e3a5f] transition-colors line-clamp-1">
        {name}
      </h3>
      <button 
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
        title="Remove from favorites"
      >
        <Trash2 size={18} />
      </button>
    </div>
    <p className="text-sm text-slate-500 mb-8 flex-grow leading-relaxed font-medium line-clamp-2">
      {description}
    </p>
    <div className="mt-auto">
      <Button 
        variant="primary" 
        onClick={onAddToCart}
        className="flex items-center justify-center gap-2 group/btn"
      >
        <ShoppingCart size={18} className="transition-transform group-hover/btn:-translate-y-0.5" />
        Add to Cart
      </Button>
    </div>
  </div>
);

const FavoriteCard = ({ product, onRemove, onAddToCart }) => {
  return (
    <div 
      className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col group hover:-translate-y-2 transition-all duration-300 h-full"
    >
      <FavoriteCardImage 
        src={product.image} 
        alt={product.name} 
        category={product.category} 
      />
      <FavoriteCardContent 
        name={product.name}
        description={product.description}
        onRemove={() => onRemove(product.id)}
        onAddToCart={() => onAddToCart(product)}
      />
    </div>
  );
};

export default FavoriteCard;
