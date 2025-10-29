import React from 'react';
import { Link } from 'react-router-dom';

const PozeHeader: React.FC = () => {
  return (
    <header 
      className="cs_site_header cs_style_1 cs_version_5 cs_sticky_header cs_medium"
    >
      <div className="cs_main_header">
        <div className="container">
          <div className="cs_main_header_in">
            <div className="cs_main_header_left">
              <Link className="cs_site_branding" to="/" aria-label="Home page link">
                <img 
                  src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761244578/freepik__background__64708_1_ilskfj.png" 
                  alt="Klarus HR Logo" 
                  className="cs_logo-responsive"
                />
              </Link>
            </div>
            <div className="cs_main_header_center">
              <nav className="cs_nav cs_medium cs_primary_font">
                <ul className="cs_nav_list cs_onepage_nav">
                  {/* Mobile Menu Logo */}
                  <li className="cs_mobile_menu_logo">
                    <img 
                      src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761244578/freepik__background__64708_1_ilskfj.png" 
                      alt="Klarus HR Logo" 
                      className="cs_mobile_logo"
                    />
                  </li>
                  <li><a href="#home" aria-label="Menu link">Home</a></li>
                  <li><a href="#features" aria-label="Menu link">Features</a></li>
                  <li><a href="#testimonial" aria-label="Menu link">Testimonial</a></li>
                  <li><a href="#faq" aria-label="Menu link">Faq</a></li>
                  <li><a href="#contact" aria-label="Menu link">Contact</a></li>
                  {/* Mobile Authentication Buttons */}
                  <li className="cs_mobile_auth_btns">
                    <Link to="/login" className="cs_login-btn">Login</Link>
                    <Link to="/signup" className="cs_signup-btn">Sign Up</Link>
                  </li>
                  {/* Mobile Social Icons */}
                  <li className="cs_mobile_social_icons">
                    <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                  </li>
                  {/* Powered by Klarus AI */}
                  <li className="cs_mobile_powered_by">
                    <span>Powered by Klarus AI</span>
                  </li>
                </ul>
                <span className="cs_close_nav"></span>
                {/* Mobile Menu Toggle - Always present */}
                <span className="cs_menu_toggle">
                  <span></span>
                </span>
              </nav>
            </div>
            <div className="cs_main_header_right">
              <div className="cs_header_btns">
                <Link to="/login" aria-label="Login button" className="cs_header_text_btn cs_login-btn">Login</Link>
                <Link to="/signup" aria-label="Sign-up button" className="cs_btn cs_type_1 cs_bg_white cs_light_hover cs_signup-btn">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PozeHeader;

