
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
    <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 relative">
        {/* Logo */}
        <div className="text-foreground font-bold text-xl sm:text-2xl tracking-wider">
          Klarus HR
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 lg:gap-12 items-center text-base lg:text-lg font-medium text-foreground">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <a href="#features" className="hover:text-primary transition">Features</a>
          <Link 
            to="/signup" 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="text-foreground p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-sm shadow-lg border-b border-border py-4 flex flex-col items-center gap-4 text-foreground text-base font-medium md:hidden">
            <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 hover:text-primary transition">Home</Link>
            <a href="#features" onClick={() => setMenuOpen(false)} className="py-2 hover:text-primary transition">Features</a>
            <Link 
              to="/signup" 
              onClick={() => setMenuOpen(false)} 
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
