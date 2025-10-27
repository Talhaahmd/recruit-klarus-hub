import React from 'react';
import { Link } from 'react-router-dom';

const PozeFooter: React.FC = () => {
  return (
    <footer className="cs_site_footer cs_color_1 cs_sticky_footer">
      <div className="cs_footer_shape1">
        <img src="/poze-assets/img/Vector1.svg" alt="Vector-Icon" />
      </div>
      <div className="cs_height_140 cs_height_lg_70"></div>
      <div className="cs_main_footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-xl-4">
              <div className="cs_footer_widget">
                <div className="cs_text_field">
                  <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761244578/freepik__background__64708_1_ilskfj.png" alt="Klarus HR Logo" className="cs_footer_logo cs_footer_logo_responsive" />
                  <p className="cs_text_white mb-0">
                    Your Full Stack Linkedin Developer
                  </p>
                </div>
              </div>
              <div className="cs_footer_widget">
                <div className="cs_social_btn cs_style_1 d-flex">
                  <a href="https://www.facebook.com/" aria-label="Social link" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="https://www.twitter.com/" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-twitter"></i>
                  </a>
                  <a href="https://www.linkedin.com/" aria-label="Social link" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a href="https://www.instagram.com/" aria-label="Social link" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </div>
              </div>
              <div className="cs_height_0 cs_height_lg_30"></div>
            </div>
            <div className="col-lg-2 col-xl-2 offset-lg-1">
              <div className="cs_footer_widget">
                <h2 className="cs_footer_widget_title">Quick Links</h2>
                <ul className="cs_footer_widget_nav cs_mp0">
                  <li><Link to="/" aria-label="Footer link">Home</Link></li>
                  <li><a href="/#about" aria-label="Footer link">Features</a></li>
                  <li><a href="/#contact" aria-label="Footer link">Contact</a></li>
                </ul>
              </div>
              <div className="cs_height_0 cs_height_lg_30"></div>
            </div>
            <div className="col-xl-1 col-lg-2">
              <div className="cs_footer_widget">
                <h2 className="cs_footer_widget_title">Supports</h2>
                <ul className="cs_footer_widget_nav cs_mp0">
                  <li><a href="/#faq" aria-label="Footer link">Faq's</a></li>
                  <li><a href="#" aria-label="Footer link">Articles</a></li>
                  <li><a href="#" aria-label="Footer link">Live Chat</a></li>
                </ul>
              </div>
              <div className="cs_height_0 cs_height_lg_30"></div>
            </div>
            <div className="col-lg-4 col-xl-3 offset-xl-1">
              <div className="cs_footer_widget">
                <h2 className="cs_footer_widget_title">Subscribe Newsletter</h2>
                <form className="cs_newsletter cs_type_1 position-relative">
                  <input type="text" placeholder="Your email address" className="cs_form_field" />
                  <button type="submit" aria-label="Submit button" className="cs_btn cs_type_1 cs_bg_accent cs_send">
                    Send
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.147 1.75739C10.147 1.28795 9.76649 0.907395 9.29705 0.907394L1.64705 0.907394C1.17761 0.907395 0.797048 1.28795 0.797048 1.75739C0.797048 2.22684 1.17761 2.60739 1.64705 2.60739H8.44705V9.4074C8.44705 9.87684 8.82761 10.2574 9.29705 10.2574C9.76649 10.2574 10.147 9.87684 10.147 9.4074L10.147 1.75739ZM1.41281 10.8437L9.89809 2.35844L8.69601 1.15635L0.210727 9.64163L1.41281 10.8437Z" fill="currentColor"></path>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="cs_height_110 cs_height_lg_50"></div>
        </div>
        <div className="container cs_copyright_text cs_text_white text-center">
          &copy; Copyright 2025. Design by
          <a href="https://themeforest.net/user/awesomethemez/portfolio" aria-label="Site link" target="_blank" rel="noreferrer" className="cs_site_link cs_text_accent"> AwesomeThemez</a>
        </div>
      </div>
    </footer>
  );
};

export default PozeFooter;

