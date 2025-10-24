import React from 'react';
import { Link } from 'react-router-dom';

const PozeHeader: React.FC = () => {
  return (
    <header 
      className="cs_site_header cs_style_1 cs_version_5 cs_sticky_header cs_medium" 
      style={{ 
        backgroundColor: 'white !important', 
        background: 'white !important',
        color: 'black !important'
      }}
    >
      <div className="cs_main_header" style={{ backgroundColor: 'white !important', background: 'white !important' }}>
        <div className="container">
          <div className="cs_main_header_in" style={{ backgroundColor: 'white !important', background: 'white !important' }}>
            <div className="cs_main_header_left">
              <Link className="cs_site_branding" to="/" aria-label="Home page link">
                <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761244578/freepik__background__64708_1_ilskfj.png" alt="Klarus HR Logo" style={{ height: '100px !important', width: 'auto !important' }} />
              </Link>
            </div>
            <div className="cs_main_header_center">
              <nav className="cs_nav cs_medium cs_primary_font">
                <ul className="cs_nav_list cs_onepage_nav">
                  <li><a href="#home" aria-label="Menu link" style={{ color: 'black !important' }}>Home</a></li>
                  <li><a href="#features" aria-label="Menu link" style={{ color: 'black !important' }}>Features</a></li>
                  <li><a href="#testimonial" aria-label="Menu link" style={{ color: 'black !important' }}>Testimonial</a></li>
                  <li><a href="#faq" aria-label="Menu link" style={{ color: 'black !important' }}>Faq</a></li>
                  <li><a href="#contact" aria-label="Menu link" style={{ color: 'black !important' }}>Contact</a></li>
                </ul>
                <span className="cs_close_nav"></span>
              </nav>
            </div>
            <div className="cs_main_header_right">
              <div className="cs_header_btns">
                <Link to="/login" aria-label="Login button" className="cs_header_text_btn" style={{ color: 'black !important' }}>Login</Link>
                <Link to="/signup" aria-label="Sign-up button" className="cs_btn cs_type_1 cs_bg_accent cs_light_hover">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PozeHeader;

