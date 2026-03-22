import { Link, NavLink } from 'react-router';
import { Heart, ShoppingCart, ShoppingBag, User, ChevronDown, LogOut, Settings, Lock } from 'lucide-react';

const Navbar = ({ 
  logo, 
  navLinks, 
  isLoggedIn, 
  isUserMenuOpen, 
  setIsUserMenuOpen, 
  handleLogout,
  toggleMenu 
}) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Khodiyar Enterprise Logo" className="h-12" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                relative py-2 px-1 font-semibold transition-all duration-300
                ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'}
                group
              `}
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{link.name}</span>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-secondary transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                  {!isActive && (
                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-0 group-hover:w-full transition-all duration-300" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <div className="flex items-center gap-6 ml-4">
              <div className="flex items-center gap-5 border-r border-slate-200 pr-6">
                <Link to="/favorites" className="relative text-slate-600 hover:text-primary transition-colors p-2 hover:bg-slate-50 rounded-full">
                  <Heart size={22} />
                  <span className="absolute top-0 right-0 bg-secondary text-primary text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">2</span>
                </Link>
                <Link to="/cart" className="relative text-slate-600 hover:text-primary transition-colors p-2 hover:bg-slate-50 rounded-full">
                  <ShoppingCart size={22} />
                  <span className="absolute top-0 right-0 bg-secondary text-primary text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">3</span>
                </Link>
                <Link to="/orders" className="text-slate-600 hover:text-primary transition-colors p-2 hover:bg-slate-50 rounded-full">
                  <ShoppingBag size={22} />
                </Link>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <User size={20} />
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in origin-top-right">
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px]">Logged in as</p>
                        <p className="font-bold text-slate-800">Neel Pandya</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors text-sm font-medium">
                        <User size={18} className="text-slate-400" /> Edit Profile
                      </Link>
                      <Link to="/change-password" className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors text-sm font-medium">
                        <Lock size={18} className="text-slate-400" /> Change Password
                      </Link>
                      <div className="h-px bg-slate-100 my-1 mx-4" />
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-bold">
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Get Started</Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-800 focus:outline-none z-50 p-2 hover:bg-slate-100 rounded-full transition-colors"
          onClick={toggleMenu}
        >
          <User size={28} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
