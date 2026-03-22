import React, { useState } from 'react';
import { Bell, Search, ChevronDown, Calendar, Menu } from 'lucide-react';

const AdminTopbar = ({ onMenuClick }) => {
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'New order #KE-1022 received', time: '2 min ago', unread: true },
    { id: 2, text: 'Customer payment confirmed', time: '18 min ago', unread: true },
    { id: 3, text: 'Monthly report is ready', time: '1 hr ago', unread: false },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;

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

      {/* Right: Date + Notifications */}
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        {/* Date pill — hidden on small */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
          <Calendar size={13} />
          {today}
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2 rounded-xl hover:bg-slate-100 hover:scale-105 active:scale-95 text-slate-600 transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                <span className="text-xs text-[#1e3a5f] font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`px-4 py-3 text-sm border-b border-slate-50 last:border-0 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-blue-50/40' : ''}`}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-[#1e3a5f]' : 'bg-slate-300'}`} />
                    <div>
                      <p className="text-slate-700 font-medium leading-snug">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
