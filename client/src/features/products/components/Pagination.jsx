import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
  return (
    <div className="mt-20 flex justify-center items-center gap-4">
      <button className="p-4 rounded-2xl bg-white border border-gray-100 text-text-muted hover:text-primary transition-all disabled:opacity-50">
        <ChevronLeft size={24} />
      </button>
      <div className="flex gap-2">
        {[1, 2, 3].map((page) => (
          <button 
            key={page}
            className={`w-12 h-12 rounded-2xl font-bold flex items-center justify-center transition-all ${
              page === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-gray-100 text-text-muted hover:border-primary/30'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button className="p-4 rounded-2xl bg-white border border-gray-100 text-text-muted hover:text-primary transition-all">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Pagination;
