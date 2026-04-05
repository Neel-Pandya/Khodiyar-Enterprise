import React, { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';
import EmptyOrders from '../components/EmptyOrders';
import { Filter, ChevronRight, Loader2, ArrowUpDown } from 'lucide-react';
import { useOrdersQuery } from '@/hooks/useOrderQueries';

const OrderHistoryPage = () => {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const limit = 10;

  const statusParam = filter === 'all' ? undefined : filter;
  
  const { data, isLoading, error } = useOrdersQuery({
    page,
    limit,
    status: statusParam,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const filterTabs = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

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

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm font-semibold text-slate-500">Sort by:</span>
          <button
            onClick={() => handleSort('created_at')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              sortBy === 'created_at' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Date {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('total_amount')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              sortBy === 'total_amount' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Amount {sortBy === 'total_amount' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('status')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              sortBy === 'status' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {/* List */}
        <div className="grid gap-6 md:gap-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-medium mb-2">Failed to load orders</p>
              <p className="text-slate-400 text-sm">{error.message}</p>
            </div>
          ) : orders.length > 0 ? (
            <>
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </>
          ) : (
            <EmptyOrders />
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-slate-500">
              Showing {orders.length} of {pagination.total} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-slate-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

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