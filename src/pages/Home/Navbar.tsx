
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

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                className="w-auto h-8 lg:h-10" 
                src="https://media.licdn.com/dms/image/v2/D4D0BAQFDM9EHPi7Ytw/company-logo_200_200/B4DZcS5YkIGYAM-/0/1748368723047/klarushr_logo?e=1753920000&v=beta&t=XHn_4UOG1fh73hgQQ9sxGxyoXACiu8PpgDqsjpgvW9w" 
                alt="Klarus HR Logo" 
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50" 
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {!isMenuOpen ? (
                <Menu className="w-6 h-6" />
              ) : (
                <X className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-8">
            <button 
              onClick={scrollToFeatures}
              className="text-base font-medium text-gray-700 transition-colors hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Features
            </button>
            <Link 
              to="/pricing" 
              className="text-base font-medium text-gray-700 transition-colors hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Pricing
            </Link>
            <button 
              onClick={scrollToDemo}
              className="text-base font-medium text-gray-700 transition-colors hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Book a Demo
            </button>
            <Link 
              to="/login" 
              className="text-base font-medium text-gray-700 transition-colors hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center px-6 py-2.5 text-base font-semibold text-white bg-blue-600 rounded-lg transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-md hover:shadow-lg"
            >
              Sign Up
            </Link>
          </nav>
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-2 py-6 space-y-1">
              <button 
                onClick={scrollToFeatures}
                className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Features
              </button>
              <Link 
                to="/pricing" 
                className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <button 
                onClick={scrollToDemo}
                className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Book a Demo
              </button>
              <Link 
                to="/login" 
                className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <div className="pt-2">
                <Link 
                  to="/signup" 
                  className="flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
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
