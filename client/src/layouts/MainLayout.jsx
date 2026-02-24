import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Home,
  Package,
  Info,
  Phone,
  Menu,
  Mail,
  MapPin,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import logo from '../assets/Khodiyar_Enterprise.svg';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Contact Us', path: '/contact', icon: Phone },
  ];

  const menuVariants = {
    closed: { x: '100%', transition: { type: 'spring', damping: 25, stiffness: 200 } },
    open: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200, staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen">
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
                  ${isActive
                    ? 'text-primary'
                    : 'text-slate-600 hover:text-primary'}
                  group
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.name}</span>
                    <motion.div
                      initial={false}
                      animate={{
                        width: isActive ? '100%' : '0%',
                        opacity: isActive ? 1 : 0
                      }}
                      className="absolute bottom-0 left-0 h-0.5 bg-secondary"
                    />
                    {!isActive && (
                      <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-0 group-hover:w-full transition-all duration-300" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <Link to="/login" className="btn btn-primary">Get Started</Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-800 focus:outline-none z-50 p-2 hover:bg-slate-100 rounded-full transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleMenu}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              />
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
              >
                {/* Mobile Menu Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <img src={logo} alt="Logo" className="h-10" />
                  <button
                    onClick={toggleMenu}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-grow overflow-y-auto py-8 px-6">
                  <div className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                      <motion.div key={link.name} variants={itemVariants}>
                        <NavLink
                          to={link.path}
                          onClick={toggleMenu}
                          className={({ isActive }) => `
                            flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                            ${isActive
                              ? 'bg-primary shadow-lg shadow-primary/20 text-white'
                              : 'text-slate-800 hover:bg-slate-50 hover:text-primary'}
                            group
                          `}
                        >
                          {({ isActive }) => (
                            <>
                              <div className="flex items-center gap-4">
                                <div className={`
                                  p-2 rounded-xl transition-colors
                                  ${isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary'}
                                `}>
                                  <link.icon size={22} />
                                </div>
                                <span className={`text-lg font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                                  {link.name}
                                </span>
                              </div>
                              <ChevronRight
                                size={18}
                                className={`transition-colors ${isActive ? 'text-white/60' : 'text-slate-400 group-hover:text-primary'}`}
                              />
                            </>
                          )}
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div variants={itemVariants} className="mt-8">
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="btn btn-primary w-full py-5 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20"
                    >
                      Get Started <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                </div>

                {/* Contact Info Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Contact Us</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail size={16} className="text-primary" />
                      <span className="text-sm">info@khodiyar.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone size={16} className="text-primary" />
                      <span className="text-sm">+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                      <MapPin size={16} className="text-primary" />
                      <span className="text-sm font-semibold">Ahmedabad, Gujarat</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-primary text-white py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2026 Khodiyar Enterprise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
