import React from 'react';
import { CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

/**
 * A small utility component to handle status-based coloring for orders.
 * @param {string} status - The status of the order (Delivered, Processing, Shipped, Cancelled).
 */
const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    delivered: {
      style: "bg-green-50 text-green-700 border-green-100",
      icon: <CheckCircle2 size={12} className="mr-1.5" />
    },
    processing: {
      style: "bg-amber-50 text-amber-700 border-amber-100",
      icon: <Clock size={12} className="mr-1.5" />
    },
    shipped: {
      style: "bg-blue-50 text-blue-700 border-blue-100",
      icon: <Truck size={12} className="mr-1.5" />
    },
    cancelled: {
      style: "bg-rose-50 text-rose-700 border-rose-100",
      icon: <XCircle size={12} className="mr-1.5" />
    },
    default: {
      style: "bg-slate-50 text-slate-600 border-slate-100",
      icon: <Clock size={12} className="mr-1.5" />
    }
  };

  const currentStatus = status?.toLowerCase() || 'default';
  const config = statusConfig[currentStatus] || statusConfig.default;
  
  return (
    <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm transition-all duration-300 ${config.style}`}>
      {config.icon}
      {status}
    </span>
  );
};

export default OrderStatusBadge;
