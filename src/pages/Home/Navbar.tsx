// src/components/Navbar.tsx
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
    <header
      className={`fixed top-10 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/10 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 relative">
        {/* Logo */}
        <div className="text-white font-bold text-2xl tracking-wider">
          Klarus HR
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-12 items-center text-lg font-medium text-white">
          <Link to="/" className="hover:text-blue-300 transition">Home</Link>
          <a href="#features" className="hover:text-blue-300 transition">Features</a>
          <Link to="/signup" className="hover:text-blue-300 transition">Sign Up</Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/70 backdrop-blur-md shadow-md py-6 flex flex-col items-center gap-6 text-white text-lg font-medium md:hidden">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
