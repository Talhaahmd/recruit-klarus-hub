
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link to="/#demo" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white">
              Book a Demo
            </Link>
            <Link to="/signup" className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white">
              Sign Up
            </Link>
          </nav>

          <div className="relative hidden md:justify-center md:items-center md:inline-flex group">
            <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
            <Link to="/login" className="relative inline-flex items-center justify-center px-6 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full">
              Login
            </Link>
          </div>
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
              <Link 
                to="/#demo" 
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Book a Demo
              </Link>
              <Link 
                to="/signup" 
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>

              <div className="relative inline-flex items-center justify-center group">
                <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                <Link 
                  to="/login" 
                  className="relative inline-flex items-center justify-center w-full px-6 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
