import { useEffect } from 'react';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import Button from '@common/Button';
import FavoriteCard from '../components/FavoriteCard';
import useFavoriteStore from '@/store/useFavoriteStore';
import { useFavoritesQuery, useRemoveFavoriteMutation } from '@/hooks/useFavoriteQueries';
import * as toast from "@/utils/toast"
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
      Looks like you haven&apos;t added any items to your favorites yet. Start exploring our premium collection of industrial components.
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
  const { favorites, pagination, optimisticRemove, rollbackRemove } = useFavoriteStore();
  const { isLoading } = useFavoritesQuery({ limit: 12 });
  const { mutateAsync: removeFavorite } = useRemoveFavoriteMutation();

  const handleRemove = async (productId) => {
    // Optimistic update first
    const previousState = optimisticRemove(productId);
    try {
      await removeFavorite(productId);
    } catch (error) {
      // Rollback on error
      rollbackRemove(previousState);
      toast.error(error.message);
    }
  };

  const handleAddToCart = (product) => {
    if (!product.is_active) return;
    // Logic for adding to cart
  };

  // Extract product data from favorites (favorites contain product relation)
  const products = favorites.map((f) => ({
    ...f.product,
    favoriteId: f.id,
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-12">
      <div className="container mx-auto px-6">
        <FavoritesHeader count={pagination.total} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-50 h-[400px] animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-10 bg-gray-200 rounded w-1/2 mt-8" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
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
