import React, { useState } from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { categories } from '../data/products';

const ProductFilters = () => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  return (
    <section className="mb-12 py-4 bg-white/80 backdrop-blur-xl border-y border-gray-100 shadow-sm">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Find components..." 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
            />
          </div>

          {/* Filter Toggle */}
          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all w-full md:w-auto ${
              isFilterPanelOpen 
                ? 'bg-secondary text-primary shadow-secondary/20' 
                : 'bg-primary text-white shadow-primary/20 hover:bg-accent'
            }`}
          >
            {isFilterPanelOpen ? <X size={18} /> : <Filter size={18} />}
            Filter
          </button>
        </div>

        {/* Advanced Filter Panel */}
        {isFilterPanelOpen && (
          <div className="overflow-hidden transition-all duration-300">
            <div className="pt-8 pb-4 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-gray-100 mt-6 md:mt-8">
              {/* Category Selection */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
                  Select Category
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        cat === 'All' 
                          ? 'bg-primary text-white shadow-lg shadow-primary/10' 
                          : 'bg-gray-50 text-text-muted hover:bg-gray-100 border border-transparent hover:border-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
                  <ArrowUpDown size={14} /> Sort Results
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: 'name-asc', label: 'Name (A-Z)' },
                    { id: 'name-desc', label: 'Name (Z-A)' },
                    { id: 'category', label: 'By Category' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        option.id === 'name-asc'
                          ? 'bg-primary text-white shadow-lg shadow-primary/10'
                          : 'bg-gray-50 text-text-muted border border-transparent hover:border-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button 
                className="px-6 py-3 rounded-xl font-bold text-sm text-text-muted hover:text-primary transition-colors"
                onClick={() => setIsFilterPanelOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-8 py-3 bg-secondary text-primary rounded-xl font-black text-sm shadow-xl shadow-secondary/10 hover:shadow-secondary/20 transition-all hover:-translate-y-0.5"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductFilters;
