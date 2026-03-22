import React from 'react';
import { Link } from 'react-router';
import OrderStatusBadge from './OrderStatusBadge';
import Button from '@common/Button';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';

const OrderCard = ({ order }) => {
  return (
    <div className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-5 md:p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-slate-200">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors duration-500">
             <Calendar size={20} className="md:size-[24px] text-primary/40 group-hover:text-primary transition-colors duration-500" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
              <h3 className="font-black text-primary text-lg md:text-xl tracking-tight">Order #{order.id}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Placed on {order.date}</p>
          </div>
        </div>
      </div>


      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-5 md:pt-6 border-t border-slate-50 gap-5 md:gap-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
             <MapPin size={14} />
          </div>
          <p className="text-sm text-slate-500 font-bold">
            <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest block leading-none mb-0.5">Shipping to</span>
            <span className="text-primary text-xs md:text-sm">{order.shortAddress}</span>
          </p>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 w-full md:w-auto">
          <div>
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Grand Total</span>
            <span className="text-xl md:text-2xl font-black text-primary tracking-tighter">₹{order.total.toLocaleString()}</span>
          </div>
          <Link to={`/orders/${order.id}`} className="flex-shrink-0">
            <Button className="!py-2.5 md:!py-3 !px-6 md:!px-8 !rounded-xl md:!rounded-2xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all group/btn">
              <span className="inline-flex items-center gap-2 text-xs md:text-sm">
                Details
                <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;