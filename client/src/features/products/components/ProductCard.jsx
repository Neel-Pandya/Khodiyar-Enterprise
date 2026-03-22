import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col group hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="h-64 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-primary mb-3 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-text-muted mb-8 flex-grow leading-relaxed font-medium line-clamp-2">
          {product.description}
        </p>
        <button 
          onClick={() => navigate(`/product/${product.id}`)}
          className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-accent transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 group/btn cursor-pointer"
        >
          View Details
          <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
