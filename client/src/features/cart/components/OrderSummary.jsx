import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';

const SummaryRow = ({ label, value, isBold = false, isTotal = false }) => (
  <div className={`flex justify-between items-center ${isBold ? 'font-black' : 'font-medium'} ${isTotal ? 'text-primary' : 'text-text-muted'}`}>
    <span className={isTotal ? 'text-lg' : 'text-sm'}>{label}</span>
    <span className={isTotal ? 'text-2xl' : 'text-base'}>₹{value.toLocaleString()}</span>
  </div>
);

const OrderSummary = ({ subtotal }) => {
  const total = subtotal;

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-gray-200/60 border border-gray-100 flex flex-col gap-8 sticky top-24 transition-all duration-300">
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
        <ShoppingBag className="text-primary" size={24} />
        <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Order Summary</h2>
      </div>

      <div className="flex flex-col gap-4">
        <SummaryRow label="Subtotal (Products)" value={subtotal} />
        
        <div className="pt-6 mt-2 border-t border-dashed border-gray-200">
          <SummaryRow label="Total Amount" value={total} isBold isTotal />
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <button className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm hover:bg-accent transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group/btn">
          Proceed to Checkout
          <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
        
        <Link 
          to="/products"
          className="w-full py-5 bg-gray-50 text-primary border border-gray-100 rounded-2xl font-black text-sm hover:bg-white hover:border-primary transition-all flex items-center justify-center gap-2"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
        <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest text-center leading-relaxed">
          Secure payment guaranteed. All major cards accepted.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
