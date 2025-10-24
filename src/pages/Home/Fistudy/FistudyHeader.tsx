import React from 'react';
import { Link } from 'react-router-dom';

const FistudyHeader: React.FC = () => {
  return (
    <header className="main-header">
      <div className="main-menu__top">
        <div className="container">
          <div className="main-menu__top-inner">
            <ul className="list-unstyled main-menu__contact-list">
              <li>
                <div className="icon">
                  <i className="icon-email"></i>
                </div>
                <div className="text">
                  <p><a href="mailto:hello@klarus.io">hello@klarus.io</a></p>
                </div>
              </li>
              <li>
                <div className="icon">
                  <i className="icon-contact"></i>
                </div>
                <div className="text">
                  <p><a href="tel:+18001234567">+1 (800) 123-4567</a></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <nav className="main-menu">
        <div className="main-menu__wrapper">
          <div className="container">
            <div className="main-menu__wrapper-inner">
              <div className="main-menu__left">
                <div className="main-menu__logo">
                  <Link to="/">
                    <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761244578/freepik__background__64708_1_ilskfj.png" alt="Klarus HR Logo" style={{height: '100px', width: 'auto'}} />
                  </Link>
                </div>
              </div>
              <div className="main-menu__main-menu-box">
                <a href="#" className="mobile-nav__toggler"><i className="fa fa-bars"></i></a>
                <ul className="main-menu__list">
                  <li><Link to="/">Home</Link></li>
                  <li><a href="#solutions">Solutions</a></li>
                  <li><a href="#platforms">Platforms</a></li>
                  <li><a href="#metrics">Metrics</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="main-menu__right">
                <div className="main-menu__btn-boxes">
                  <div className="main-menu__btn-box-1">
                    <Link to="/login" className="thm-btn">Login</Link>
                  </div>
                  <div className="main-menu__btn-box-2">
                    <Link to="/signup" className="thm-btn">Get Started</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="stricky-header stricked-menu main-menu">
        <div className="sticky-header__content"></div>
      </div>
    </header>
  );
};

export default FistudyHeader;
