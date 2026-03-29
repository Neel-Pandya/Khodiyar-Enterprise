import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Home, Package, Info, Phone } from 'lucide-react';
import logo from '../assets/Khodiyar_Enterprise.svg';

// Layout Components
import Navbar from './components/Navbar';
import MobileSidebar from './components/MobileSidebar';
import Footer from './components/Footer';
import useAuthStore from '../store/useAuthStore';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const isLoggedIn = !!user;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Contact Us', path: '/contact', icon: Phone },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        logo={logo}
        navLinks={navLinks}
        isLoggedIn={isLoggedIn}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleLogout={handleLogout}
        toggleMenu={toggleMenu}
      />

      <MobileSidebar 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        logo={logo}
        navLinks={navLinks}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
