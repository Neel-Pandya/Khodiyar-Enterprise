import React from 'react';
import { Search, ChevronDown, Calendar, Menu } from 'lucide-react';

const AdminTopbar = ({ onMenuClick }) => {

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30">
      {/* Left: Mobile hamburger + Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="Open menu">
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-xs md:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, customers…"
            className="
              w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200
              rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]/40
              text-slate-700 placeholder:text-slate-400 transition
            "
          />
        </div>
      </div>

      {/* Right: Date */}
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        {/* Date pill — hidden on small */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
          <Calendar size={13} />
          {today}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
