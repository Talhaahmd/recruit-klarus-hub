import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/klarus-logo.jpeg" 
            alt="Klarus HR Logo" 
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          <div className="flex gap-8 lg:gap-12 items-center text-base lg:text-lg font-medium text-foreground">
            {[
              { href: '#solutions', label: 'Solutions' },
              { href: '#platforms', label: 'Platforms' },
              { href: '#metrics', label: 'Metrics' },
              { href: '#success', label: 'Success' },
              { href: '#resources', label: 'Resources' }
            ].map((item, idx) => (
              <a key={idx} href={item.href} className="relative hover:text-primary transition-colors">
                <span>{item.label}</span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          
          <Link 
            to="/signup" 
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-md shadow-lg border-b border-border py-6 flex flex-col items-center gap-6 text-foreground text-base font-medium md:hidden"
          >
            <a href="#solutions" onClick={() => setMenuOpen(false)} className="py-2 hover:text-primary transition-colors">Solutions</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-2 hover:text-primary transition-colors">Pricing</a>
            <a href="#resources" onClick={() => setMenuOpen(false)} className="py-2 hover:text-primary transition-colors">Resources</a>
            <Link 
              to="/signup" 
              onClick={() => setMenuOpen(false)} 
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold"
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Navbar;