import { NavLink, Link } from 'react-router';
import { X, ChevronRight, Heart, ShoppingCart, User, Lock, LogOut, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  logo, 
  navLinks, 
  isLoggedIn, 
  handleLogout
}) => {
  const { user } = useAuthStore();
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <img src={logo} alt="Logo" className="h-10" />
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto py-8 px-6">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                  ${isActive ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'text-slate-800 hover:bg-slate-50 hover:text-primary'}
                  group
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <link.icon size={22} />
                      </div>
                      <span className={`text-lg font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>{link.name}</span>
                    </div>
                    <ChevronRight size={18} className={`transition-colors ${isActive ? 'text-white/60' : 'text-slate-400 group-hover:text-primary'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="px-4 mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Profile</p>
                  <div className="flex items-center gap-3">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                    <p className="text-lg font-bold text-slate-800">{user?.name || user?.email || "User"}</p>
                  </div>
                </div>
                <Link to="/favorites" onClick={onClose} className="flex items-center gap-4 p-4 rounded-2xl text-slate-800 hover:bg-slate-50 hover:text-primary transition-all font-semibold">
                  <div className="p-2 bg-slate-100 rounded-xl"><Heart size={20} /></div> Favorites
                </Link>
                <Link to="/cart" onClick={onClose} className="flex items-center gap-4 p-4 rounded-2xl text-slate-800 hover:bg-slate-50 hover:text-primary transition-all font-semibold">
                  <div className="p-2 bg-slate-100 rounded-xl"><ShoppingCart size={20} /></div> Cart
                </Link>
                <Link to="/profile" onClick={onClose} className="flex items-center gap-4 p-4 rounded-2xl text-slate-800 hover:bg-slate-50 hover:text-primary transition-all font-semibold">
                  <div className="p-2 bg-slate-100 rounded-xl"><User size={20} /></div> Edit Profile
                </Link>
                <Link to="/change-password" onClick={onClose} className="flex items-center gap-4 p-4 rounded-2xl text-slate-800 hover:bg-slate-50 hover:text-primary transition-all font-semibold">
                  <div className="p-2 bg-slate-100 rounded-xl"><Lock size={20} /></div> Change Password
                </Link>
                <button
                  onClick={() => { handleLogout(); onClose(); }}
                  className="flex items-center gap-4 p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-bold w-full"
                >
                  <div className="p-2 bg-red-100 rounded-xl text-red-600"><LogOut size={20} /></div> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={onClose} className="btn btn-primary w-full py-5 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20">
                Get Started <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Contact Us</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail size={16} className="text-primary" /> <span className="text-sm">info@khodiyar.com</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone size={16} className="text-primary" /> <span className="text-sm">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 font-medium">
              <MapPin size={16} className="text-primary" /> <span className="text-sm font-semibold">Ahmedabad, Gujarat</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
