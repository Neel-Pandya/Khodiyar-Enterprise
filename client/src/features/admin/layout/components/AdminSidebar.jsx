import { NavLink } from 'react-router';
import { X, LayoutDashboard, Users, Package, ClipboardList, Settings, LogOut, Zap } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Customers', path: '/admin/customers', icon: Users },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const SidebarContent = ({ onClose }) => (
  <div className="flex flex-col h-full bg-[#1e3a5f] text-white">
    {/* Logo */}
    <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
      <div className="flex items-center gap-2.5">
        <div>
          <p className="text-lg font-extrabold tracking-wide leading-none text-secondary">KHODIYAR</p>
          <p className="text-[10px] text-white/50 font-semibold tracking-widest uppercase">Enterprise</p>
        </div>
      </div>
      {/* Close button — mobile only */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/70 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>

    {/* Nav Items */}
    <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
      {navItems.map((item, i) => (
        <div key={item.label}>
          <NavLink
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
              ${isActive
                ? 'bg-[#fbc02d] text-[#1e3a5f] shadow-lg shadow-[#fbc02d]/20'
                : 'text-white/70 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-[#1e3a5f]' : 'text-white/60 group-hover:text-white'}
                />
                {item.label}
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 bg-[#1e3a5f] rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        </div>
      ))}
    </nav>

    {/* User Profile Footer */}
    <div className="px-4 py-4 border-t border-white/10">
      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/8 cursor-pointer transition-colors group">
        <div className="w-9 h-9 rounded-full bg-[#fbc02d] flex items-center justify-center text-[#1e3a5f] font-bold text-sm flex-shrink-0">
          NP
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Neel Pandya</p>
          <p className="text-xs text-white/40 truncate">npandya2601@gmail.com</p>
        </div>
        <LogOut size={15} className="text-white/30 group-hover:text-white/60 flex-shrink-0 transition-colors" />
      </div>
    </div>
  </div>
);

const AdminSidebar = ({ mobileOpen, onClose }) => (
  <>
    {/* Desktop Sidebar */}
    <aside className="hidden md:flex flex-col w-60 h-screen sticky top-0 flex-shrink-0">
      <SidebarContent />
    </aside>

    {/* Mobile Overlay + Drawer */}
    {mobileOpen && (
      <>
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
        <div
          className="fixed top-0 left-0 h-full w-64 z-50 md:hidden shadow-2xl transition-transform duration-300 translate-x-0"
        >
          <SidebarContent onClose={onClose} />
        </div>
      </>
    )}
  </>
);

export default AdminSidebar;
