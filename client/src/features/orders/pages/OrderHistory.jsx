import React, { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';
import EmptyOrders from '../components/EmptyOrders';
import { Filter, ChevronRight } from 'lucide-react';

import { MOCK_ORDERS } from '@data/mockOrders';

const OrderHistoryPage = () => {
  const [filter, setFilter] = useState('all');
  
  // Using centralized mock orders data
  const orders = MOCK_ORDERS;

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status.toLowerCase() === filter);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filterTabs = ['all', 'delivered', 'processing', 'cancelled'];

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-10 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-3 md:mb-4 tracking-tighter leading-tight">My Solar Journey</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-xs flex items-center justify-center md:justify-start gap-3">
              View and manage your past orders and installations
            </p>
          </div>
          
          <div className="relative flex items-center gap-3 bg-white p-3 md:p-3.5 rounded-2xl shadow-md border border-slate-100 min-w-[220px] hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer group/select">
            <select 
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Filter orders by status"
            >
              {filterTabs.map(tab => (
                <option key={tab} value={tab} className="bg-white text-primary uppercase font-bold text-xs">{tab}</option>
              ))}
            </select>
            
            <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-primary/40 group-hover/select:bg-primary group-hover/select:text-white transition-all duration-500">
              <Filter size={18} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black text-slate-400 opacity-60 uppercase tracking-widest block leading-none mb-1">Filter by Status</span>
              <div className="text-sm font-black text-primary uppercase tracking-widest">
                {filter}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-slate-300 group-hover/select:text-primary transition-colors">
                 <ChevronRight size={16} className="rotate-90" />
            </div>
          </div>
        </header>

        {/* List */}
        <div className="grid gap-6 md:gap-10">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <EmptyOrders />
          )}
        </div>

        {/* Support Section */}
        <div className="mt-16 md:mt-20 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-primary to-blue-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6 md:gap-8">
                <div>
                   <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Need help with an order?</h3>
                   <p className="text-sm md:text-base text-blue-100 font-medium opacity-80">Our support team is available 24/7 for your solar needs.</p>
                </div>
                <button className="w-full md:w-auto px-8 md:px-10 py-3 md:py-4 bg-white text-primary font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl md:rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300">
                    Contact Support
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;