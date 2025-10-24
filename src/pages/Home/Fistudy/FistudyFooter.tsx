import React from 'react';
import { Link } from 'react-router-dom';

const FistudyFooter: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__shape-bg"
        style={{backgroundImage: 'url(/fistudy-assets/images/shapes/site-footer-shape-bg.png)'}}></div>
      <div className="site-footer__logo-and-contact-box">
        <div className="container">
          <div className="site-footer__logo-and-contact-box-inner">
            <div className="site-footer__logo-box wow fadeInLeft" data-wow-delay="100ms">
              <div className="site-footer__logo">
                <Link to="/">
                  <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761244578/freepik__background__64708_1_ilskfj.png" alt="Klarus HR Logo" style={{height: '150px', width: 'auto'}} />
                </Link>
              </div>
              <p className="site-footer__text">Everything for rapid growth on LinkedIn, hiring and <br /> recruitment with AI chatbots and gamification</p>
            </div>
          </div>
        </div>
      </div>
      <div className="site-footer__top">
        <div className="container">
          <div className="site-footer__top-inner">
            <div className="row">
              <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay="300ms">
                <div className="site-footer__top-left">
                  <div className="site-footer__contact-info">
                    <ul className="list-unstyled site-footer__contact-info-list">
                      <li>
                        <div className="site-footer__contact-info-icon-box">
                          <div className="site-footer__contact-info-icon">
                            <span className="icon-envelope"></span>
                            <p className="site-footer__contact-info-icon-text">Email:</p>
                          </div>
                          <p className="site-footer__contact-info-text"><a href="mailto:hello@klarus.io">hello@klarus.io</a></p>
                        </div>
                      </li>
                      <li>
                        <div className="site-footer__contact-info-icon-box">
                          <div className="site-footer__contact-info-icon">
                            <span className="icon-phone"></span>
                            <p className="site-footer__contact-info-icon-text">Phone:</p>
                          </div>
                          <p className="site-footer__contact-info-text"><a href="tel:+18001234567">+1 (800) 123-4567</a></p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="site-footer__social-box" style={{marginTop: '20px'}}>
                    <h4 className="site-footer__app-and-social-title">Follow Us:</h4>
                    <div className="site-footer__social-box-inner">
                      <a href="#"><span className="fab fa-linkedin-in"></span></a>
                      <a href="#"><span className="fab fa-twitter"></span></a>
                      <a href="#"><span className="fab fa-facebook-f"></span></a>
                      <a href="#"><span className="fab fa-instagram"></span></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 wow fadeInUp" data-wow-delay="300ms">
                <div className="site-footer__top-right">
                  <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4">
                      <div className="site-footer__links">
                        <h4 className="site-footer__title">Solutions</h4>
                        <ul className="site-footer__links-list list-unstyled">
                          <li><Link to="/linkedin-recruiting"> <span className="icon-plus"></span> LinkedIn Recruiting</Link></li>
                          <li><Link to="/ats-integration"> <span className="icon-plus"></span> ATS Integration</Link></li>
                          <li><Link to="/interview-automation"> <span className="icon-plus"></span> Interview Automation</Link></li>
                          <li><Link to="/ai-agent"> <span className="icon-plus"></span> AI Agent</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4">
                      <div className="site-footer__useful-links">
                        <h4 className="site-footer__title">Resources</h4>
                        <ul className="site-footer__links-list list-unstyled">
                          <li><Link to="/blog"> <span className="icon-plus"></span> Blog</Link></li>
                          <li><Link to="/help-center"> <span className="icon-plus"></span> Help Center</Link></li>
                          <li><Link to="/hiring-strategy"> <span className="icon-plus"></span> Hiring Strategy</Link></li>
                          <li><Link to="/templates"> <span className="icon-plus"></span> Templates</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4">
                      <div className="site-footer__useful-links">
                        <h4 className="site-footer__title">Legal</h4>
                        <ul className="site-footer__links-list list-unstyled">
                          <li><Link to="/privacy-policy"> <span className="icon-plus"></span> Privacy Policy</Link></li>
                          <li><Link to="/terms-of-service"> <span className="icon-plus"></span> Terms of Service</Link></li>
                          <li><Link to="/contact"> <span className="icon-plus"></span> Contact</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="site-footer__bottom-inner">
                <div className="site-footer__copyright">
                  <p className="site-footer__copyright-text">© {new Date().getFullYear()}. Klarus HR®</p>
                </div>
                <div className="site-footer__copyright">
                  <p className="site-footer__copyright-text">We respect your privacy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FistudyFooter;
