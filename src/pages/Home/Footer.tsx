import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="pt-20 pb-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Description + Socials */}
          <div>
            <Link to="/" className="flex items-center mb-6">
              <img
                className="w-auto h-10"
                src="https://media.licdn.com/dms/image/v2/D4D0BAQFDM9EHPi7Ytw/company-logo_200_200/B4DZcS5YkIGYAM-/0/1748368723047/klarushr_logo?e=1753920000&v=beta&t=XHn_4UOG1fh73hgQQ9sxGxyoXACiu8PpgDqsjpgvW9w"
                alt="Klarus HR Logo"
              />
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Revolutionizing recruitment with AI-powered talent matching.
            </p>
            <div className="flex space-x-4">
              {['#', '#', '#'].map((href, i) => (
                <a
                  key={i}
                  href={href}
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d={
                        i === 0
                          ? 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                          : i === 1
                          ? 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675...'
                          : 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761...'
                      }
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              <li><Link to="/case-studies" className="text-gray-400 hover:text-white">Case Studies</Link></li>
              <li><Link to="/testimonials" className="text-gray-400 hover:text-white">Testimonials</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link to="/help-center" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link to="/guides" className="text-gray-400 hover:text-white">Guides</Link></li>
              <li><Link to="/api-docs" className="text-gray-400 hover:text-white">API Documentation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/legal" className="text-gray-400 hover:text-white">Legal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Klarus HR. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
