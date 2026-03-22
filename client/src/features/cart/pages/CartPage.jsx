import React from 'react';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';

// Static Data for design representation
const STATIC_CART = [
  {
    id: 1,
    name: "Solar Panel - High Efficiency Module",
    price: 27000,
    quantity: 1,
    image: "https://dn5z2jafg7hv0.cloudfront.net/blog/wp-content/uploads/2022/08/14160224/300-Watt-Solar-Panel.png"
  },
  {
    id: 2,
    name: "Earthing Cable",
    price: 100,
    quantity: 2,
    image: "https://cdn.britannica.com/94/192794-050-3F3F3DDD/panels-electricity-order-sunlight.jpg"
  }
];

const CartPage = () => {
  const subtotal = STATIC_CART.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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
              {STATIC_CART.length} items in cart
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Side: Cart Items */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {STATIC_CART.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
              />
            ))}
            
            <div className="flex justify-start pt-4">
               <p className="text-sm font-medium text-text-muted flex items-center gap-2">
                 Need more items? <span className="text-primary font-bold cursor-pointer hover:underline">Explore Products</span>
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
