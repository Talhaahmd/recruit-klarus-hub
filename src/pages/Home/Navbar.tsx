
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="py-4 bg-black sm:py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                className="w-auto h-9" 
                src="/lovable-uploads/67d45eae-154d-4a02-a7a5-1f115188b97b.png" 
                alt="Klarus HR Logo" 
              />
            </Link>
          </div>

          <div className="flex md:hidden">
            <button 
              type="button" 
              className="text-white" 
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              {!isMenuOpen ? (
                <Menu className="w-7 h-7" />
              ) : (
                <X className="w-7 h-7" />
              )}
            </button>
          </div>

          <nav className="hidden space-x-10 md:flex md:items-center md:justify-center lg:space-x-12">
            <Link to="/#features" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white">
              Features
            </Link>
            <Link to="/#process" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white">
              Our Process
            </Link>
            <button 
              onClick={scrollToDemo}
              className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
            >
              Book a Demo
            </button>
            <Link to="/signup" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white">
              Sign Up
            </Link>
          </nav>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden">
            <div className="flex flex-col pt-8 pb-4 space-y-6">
              <Link 
                to="/#features" 
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/#process" 
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Process
              </Link>
              <button 
                onClick={scrollToDemo}
                className="text-left text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
              >
                Book a Demo
              </button>
              <Link 
                to="/signup" 
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
