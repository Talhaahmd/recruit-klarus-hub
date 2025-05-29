
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
    <header className="py-4 bg-gray-50 sm:py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                className="w-auto h-9" 
                src="https://media.licdn.com/dms/image/v2/D4D0BAQFDM9EHPi7Ytw/company-logo_200_200/B4DZcS5YkIGYAM-/0/1748368723047/klarushr_logo?e=1753920000&v=beta&t=XHn_4UOG1fh73hgQQ9sxGxyoXACiu8PpgDqsjpgvW9w" 
                alt="Klarus HR Logo" 
              />
            </Link>
          </div>

          <div className="flex md:hidden">
            <button 
              type="button" 
              className="text-gray-900" 
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
            <a href="#features" className="text-base font-normal text-gray-600 transition-all duration-200 hover:text-gray-900">
              Features
            </a>
            <Link to="/pricing" className="text-base font-normal text-gray-600 transition-all duration-200 hover:text-gray-900">
              Pricing
            </Link>
            <button 
              onClick={scrollToDemo}
              className="text-base font-normal text-gray-600 transition-all duration-200 hover:text-gray-900"
            >
              Book a Demo
            </button>
            <Link to="/login" className="text-base font-normal text-gray-600 transition-all duration-200 hover:text-gray-900">
              Login
            </Link>
            <Link to="/signup" className="text-base font-normal text-white bg-blue-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-700">
              Sign Up
            </Link>
          </nav>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden">
            <div className="flex flex-col pt-8 pb-4 space-y-6">
              <a 
                href="#features" 
                className="text-base font-normal text-gray-600 transition-all duration-200 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <Link 
                to="/pricing" 
                className="text-base font-normal text-gray-600 transition-all duration-200 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <button 
                onClick={scrollToDemo}
                className="text-left text-base font-normal text-gray-600 transition-all duration-200 hover:text-gray-900"
              >
                Book a Demo
              </button>
              <Link 
                to="/login" 
                className="text-base font-normal text-gray-600 transition-all duration-200 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-base font-normal text-white bg-blue-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-700 text-center"
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
