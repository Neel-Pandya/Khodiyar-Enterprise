import React from 'react';

/**
 * Reusable component for individual line items in an order.
 * Used in both the order history summary card and the detailed order view.
 */
const OrderItem = ({ item, isCompact = false }) => {
  return (
    <div className={`flex flex-col sm:flex-row justify-between sm:items-center group/item gap-4 ${!isCompact ? 'border-b border-slate-100 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0' : ''}`}>
      <div className="flex items-center gap-4 md:gap-5">
        <div className={`relative ${isCompact ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-20 h-20 md:w-24 md:h-24'} rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0 bg-slate-50`}>
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" 
          />
          {isCompact && (
            <div className="absolute top-1.5 right-1.5 bg-primary text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg border border-white/20">
              {item.quantity}
            </div>
          )}
        </div>
        <div>
          <h4 className={`font-black text-primary group-hover/item:text-primary transition-colors mb-1 ${isCompact ? 'text-sm line-clamp-1' : 'text-base md:text-lg'}`}>
            {item.name}
          </h4>
          <div className="flex flex-col gap-0.5">
            {!isCompact && (
              <p className="text-[10px] md:text-xs text-slate-500 font-bold tracking-tight uppercase flex items-center gap-2">
                Quantity: <span className="bg-slate-100 px-2 py-0.5 rounded text-primary">{item.quantity}</span>
              </p>
            )}
            {!isCompact && (
              <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-1">
                Unit Price: <span className="text-slate-600 font-extrabold">₹{item.price.toLocaleString()}</span>
              </p>
            )}
            {isCompact && (
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    SOLAR SOLUTIONS
                </p>
            )}
          </div>
        </div>
      </div>
      <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
        {!isCompact && (
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
            Item Total
          </p>
        )}
        <p className={`font-black text-primary ${isCompact ? 'text-base md:text-lg' : 'text-xl md:text-2xl'}`}>
          ₹{(item.price * item.quantity).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
