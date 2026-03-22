import { useState } from 'react';

const ProductTabs = ({ description, specifications }) => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/50 shadow-sm">
      <div className="flex gap-8 border-b border-gray-100 overflow-x-auto scroller-hide relative">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-5 whitespace-nowrap transition-all duration-300 font-bold text-lg cursor-pointer relative tracking-wide ${
            activeTab === 'details'
              ? 'text-primary'
              : 'text-gray-400 hover:text-gray-900'
          }`}
        >
          Product Description
          {activeTab === 'details' && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-sm" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`pb-5 whitespace-nowrap transition-all duration-300 font-bold text-lg cursor-pointer relative tracking-wide ${
            activeTab === 'specs'
              ? 'text-primary'
              : 'text-gray-400 hover:text-gray-900'
          }`}
        >
          Specifications
          {activeTab === 'specs' && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-sm" />
          )}
        </button>
      </div>

      <div className="mt-10 min-h-[300px]">
        {activeTab === 'details' && (
          <div
            className="prose prose-lg max-w-none text-gray-600 leading-loose"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {activeTab === 'specs' && (
          <div className="bg-slate-50/80 rounded-2xl p-6 sm:p-10 border border-slate-200/60 prose prose-lg max-w-none relative overflow-hidden">
             {/* A subtle gradient decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-[80px] opacity-[0.05] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="relative z-10" dangerouslySetInnerHTML={{ __html: specifications }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
