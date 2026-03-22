import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import Button from '@common/Button';

/**
 * Empty state component for when a user has no orders.
 */
const EmptyOrders = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
        <ShoppingBag size={48} className="text-slate-300" />
      </div>
      
      <h3 className="text-3xl font-black text-primary mb-4 tracking-tight">
        No Orders Yet
      </h3>
      
      <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">
        It looks like you haven't placed any orders with us. Start your solar journey today and see your installations here!
      </p>
      
      <Link to="/products">
        <Button className="!px-10 !py-4 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
          Browse Products
        </Button>
      </Link>
      
      <div className="mt-12 flex items-center gap-4 text-slate-300">
        <span className="h-px w-12 bg-slate-100"></span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Khodiyar Enterprise</span>
        <span className="h-px w-12 bg-slate-100"></span>
      </div>
    </div>
  );
};

export default EmptyOrders;
