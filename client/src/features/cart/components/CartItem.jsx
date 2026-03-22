import React from 'react';
import { Trash2 } from 'lucide-react';
import QuantitySelector from './QuantitySelector';

const CartItem = ({ item }) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row items-center gap-6 group hover:shadow-2xl transition-all duration-300">
      {/* Product Image */}
      <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-xl font-black text-primary mb-1">
          {item.name}
        </h3>
        <p className="text-sm text-text-muted font-medium mb-3">
          Unit Price: ₹{item.price.toLocaleString()}
        </p>
        
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider">In Stock</span>
        </div>
      </div>

      {/* Controls & Price */}
      <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
        <div className="flex items-center gap-4">
          <QuantitySelector 
            quantity={item.quantity} 
          />
          
          <button 
            className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
            aria-label="Remove item"
          >
            <Trash2 size={20} />
          </button>
        </div>
        
        <div className="text-center md:text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Item Total</p>
          <p className="text-2xl font-black text-primary">
            ₹{(item.price * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
