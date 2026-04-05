import React, { useEffect } from 'react';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import EmptyCart from '../components/EmptyCart';
import { useCartQuery } from '@/hooks/useCartQueries';
import useCartStore from '@/store/useCartStore';
import { Loader2 } from 'lucide-react';

const CartPage = () => {
  const { data, isLoading, error } = useCartQuery();
  const { cartItems: storeCartItems, setCartItems, setPagination } = useCartStore();

  // Sync query data to store whenever data changes
  useEffect(() => {
    if (data?.cartItems) {
      setCartItems(data.cartItems);
      setPagination(data.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 });
    }
  }, [data, setCartItems, setPagination]);

  // Use store items (which now includes API data + optimistic updates)
  const cartItems = storeCartItems;

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product.price);
    return acc + (price * item.quantity);
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-12 pb-24 bg-gray-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-text-muted font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-12 pb-24 bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">Failed to load cart</p>
          <p className="text-text-muted">Please try again later</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-12 pb-24 bg-gray-50/30">
        <div className="container px-6">
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-3 tracking-tight">
            Shopping Cart
          </h1>
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24 bg-gray-50/30">
      <div className="container px-6">

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-3 tracking-tight">
            Shopping Cart
          </h1>
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/10">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Side: Cart Items */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}

            <div className="flex justify-start pt-4">
               <p className="text-sm font-medium text-text-muted flex items-center gap-2">
                 Need more items? <a href="/products" className="text-primary font-bold cursor-pointer hover:underline">Explore Products</a>
               </p>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-4">
            <OrderSummary subtotal={subtotal} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
