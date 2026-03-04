import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ quantity }) => {
  return (
    <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 w-fit">
      <button 
        className="text-primary hover:text-accent p-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={quantity <= 1}
      >
        <Minus size={18} strokeWidth={3} />
      </button>
      
      <span className="text-lg font-black text-primary min-w-[1.5rem] text-center">
        {quantity}
      </span>
      
      <button 
        className="text-primary hover:text-accent p-1 transition-colors"
      >
        <Plus size={18} strokeWidth={3} />
      </button>
    </div>
  );
};

export default QuantitySelector;
