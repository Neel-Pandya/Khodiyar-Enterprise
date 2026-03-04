import React from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-32 h-32 bg-gray-100 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner border border-gray-50">
        <ShoppingCart size={48} className="text-gray-400" />
      </div>
      
      <h2 className="text-3xl font-black text-primary mb-4 capitalize tracking-tight">
        Your cart is empty
      </h2>
      <p className="text-text-muted font-medium mb-12 max-w-md leading-relaxed">
        Looks like you haven't added anything to your cart yet. Explore our high-efficiency solar modules and accessories to get started.
      </p>
      
      <Link 
        to="/products" 
        className="btn btn-primary flex items-center gap-2 px-10 py-5 rounded-2xl shadow-xl shadow-primary/20"
      >
        <ArrowLeft size={18} />
        Start Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
