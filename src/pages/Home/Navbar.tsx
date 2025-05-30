
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 relative">
        {/* Logo */}
        <div className="text-white font-bold text-xl sm:text-2xl tracking-wider drop-shadow-lg">
          Klarus HR
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 lg:gap-12 items-center text-base lg:text-lg font-medium text-white">
          <Link to="/" className="hover:text-blue-200 transition drop-shadow-md">Home</Link>
          <a href="#features" className="hover:text-blue-200 transition drop-shadow-md">Features</a>
          <Link to="/signup" className="hover:text-blue-200 transition drop-shadow-md">Sign Up</Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors drop-shadow-md"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/20 backdrop-blur-sm shadow-lg border-t border-white/10 py-4 flex flex-col items-center gap-4 text-white text-base font-medium md:hidden">
            <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 hover:text-blue-200 transition drop-shadow-md">Home</Link>
            <a href="#features" onClick={() => setMenuOpen(false)} className="py-2 hover:text-blue-200 transition drop-shadow-md">Features</a>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="py-2 hover:text-blue-200 transition drop-shadow-md">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
