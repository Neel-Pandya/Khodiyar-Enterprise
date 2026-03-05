import { useState } from 'react';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import Button from '@common/Button';
import FavoriteCard from '../components/FavoriteCard';

// Temporary mock data based on the Project's aesthetic
const MOCK_FAVORITES = [
  {
    id: 1,
    name: 'Industrial Valve XP-200',
    description: 'High-pressure industrial valve designed for extreme environments with premium durability and precision engineering.',
    category: 'Valves',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb790b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Precision Steel Joint',
    description: 'Stainless steel joint with multi-axis rotation capability, perfect for heavy-duty machinery and manufacturing lines.',
    category: 'Components',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=800&auto=format&fit=crop'
  }
];

const FavoritesHeader = ({ count }) => (
  <div className="mb-12">
    <Link 
      to="/products" 
      className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1e3a5f] transition-colors mb-6 font-semibold group"
    >
      <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
      Back to Products
    </Link>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-[#1e3a5f] mb-3 tracking-tight">
          My Favorites
        </h1>
        <p className="text-slate-500 font-medium">
          You have <span className="text-[#1e3a5f] font-bold">{count} items</span> saved in your list
        </p>
      </div>
      <div className="hidden md:block">
        <div className="bg-[#1e3a5f]/5 px-6 py-3 rounded-2xl border border-[#1e3a5f]/10 flex items-center gap-3">
          <Heart className="text-[#1e3a5f] fill-[#1e3a5f]" size={20} />
          <span className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wider">Curated List</span>
        </div>
      </div>
    </div>
  </div>
);

const EmptyFavorites = () => (
  <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 text-slate-200">
      <Heart size={48} strokeWidth={1} />
    </div>
    <h2 className="text-3xl font-black text-[#1e3a5f] mb-4">Your list is empty</h2>
    <p className="text-slate-500 max-w-md mb-10 font-medium leading-relaxed">
      Looks like you haven't added any items to your favorites yet. Start exploring our premium collection of industrial components.
    </p>
    <Link to="/products">
      <Button variant="primary" className="px-12 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-[#1e3a5f]/20">
        <ShoppingBag size={20} />
        Start Shopping
      </Button>
    </Link>
  </div>
);

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  const handleRemove = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const handleAddToCart = (product) => {
    // Logic for adding to cart
    console.log('Adding to cart:', product);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-20">
      <div className="container mx-auto px-6">
        <FavoritesHeader count={favorites.length} />
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map(product => (
              <FavoriteCard 
                key={product.id} 
                product={product} 
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <EmptyFavorites />
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
