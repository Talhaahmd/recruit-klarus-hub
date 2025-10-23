import React from 'react';

const WhyChooseSection: React.FC = () => {
  return (
    <section className="why-choose-one">
      <div className="why-choose-one__shape-6 float-bob-x">
        <img src="/fistudy-assets/images/shapes/why-choose-one-shape-6.png" alt="" />
      </div>
      <div className="why-choose-one__shape-7 float-bob-y">
        <img src="/fistudy-assets/images/shapes/why-choose-one-shape-7.png" alt="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="why-choose-one__left wow slideInLeft" data-wow-delay="100ms" data-wow-duration="2500ms">
              <div className="why-choose-one__img-box">
                <div className="why-choose-one__img">
                  <img src="/screenshots/Video conference laptop mockup (3).jpeg" alt="Klarus Dashboard" />
                </div>
                <div className="why-choose-one__img-2">
                  <img src="/screenshots/Video conference mockup design (7).jpeg" alt="Klarus Analytics" />
                </div>
                <div className="why-choose-one__shape-1 float-bob-y">
                  <img src="/fistudy-assets/images/shapes/why-choose-one-shape-1.png" alt="" />
                </div>
                <div className="why-choose-one__shape-2 float-bob-x">
                  <img src="/fistudy-assets/images/shapes/why-choose-one-shape-2.png" alt="" />
                </div>
                <div className="why-choose-one__shape-3 float-bob-y">
                  <img src="/fistudy-assets/images/shapes/why-choose-one-shape-3.png" alt="" />
                </div>
                <div className="why-choose-one__shape-4">
                  <img src="/fistudy-assets/images/shapes/why-choose-one-shape-4.png" alt="" />
                </div>
                <div className="why-choose-one__shape-5 img-bounce">
                  <img src="/fistudy-assets/images/shapes/why-choose-one-shape-5.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="why-choose-one__right">
              <div className="section-title text-left sec-title-animation animation-style2">
                <div className="section-title__tagline-box">
                  <div className="section-title__tagline-shape"></div>
                  <span className="section-title__tagline">Why Choose Klarus</span>
                </div>
                <h2 className="section-title__title title-animation">Trusted by Leading Companies
                  <span>Worldwide <img src="/fistudy-assets/images/shapes/section-title-shape-1.png" alt="" /></span>
                </h2>
              </div>
              <p className="why-choose-one__text">Experience the future of recruitment with our comprehensive AI-powered platform designed to streamline every aspect of your hiring process.</p>
              <div className="why-choose-one__points-box">
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    <ul className="why-choose-one__points-list list-unstyled">
                      <li>
                        <div className="why-choose-one__points-icon-inner">
                          <div className="why-choose-one__points-icon">
                            <img src="/fistudy-assets/images/icon/why-choose-one-icon-1.png" alt="" />
                          </div>
                        </div>
                        <div className="why-choose-one__points-content">
                          <h3>AI-Powered Matching</h3>
                          <p>Intelligent algorithms match candidates with roles based on skills, experience, and culture fit</p>
                        </div>
                      </li>
                      <li>
                        <div className="why-choose-one__points-icon-inner">
                          <div className="why-choose-one__points-icon">
                            <img src="/fistudy-assets/images/icon/why-choose-one-icon-2.png" alt="" />
                          </div>
                        </div>
                        <div className="why-choose-one__points-content">
                          <h3>60% Faster Hiring</h3>
                          <p>Reduce time-to-hire significantly with automated workflows and smart candidate engagement</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    <ul className="why-choose-one__points-list list-unstyled">
                      <li>
                        <div className="why-choose-one__points-icon-inner">
                          <div className="why-choose-one__points-icon">
                            <img src="/fistudy-assets/images/icon/why-choose-one-icon-3.png" alt="" />
                          </div>
                        </div>
                        <div className="why-choose-one__points-content">
                          <h3>24/7 Support</h3>
                          <p>Dedicated customer success team available round-the-clock to assist your recruitment needs</p>
                        </div>
                      </li>
                      <li>
                        <div className="why-choose-one__points-icon-inner">
                          <div className="why-choose-one__points-icon">
                            <img src="/fistudy-assets/images/icon/why-choose-one__icon-4.png" alt="" />
                          </div>
                        </div>
                        <div className="why-choose-one__points-content">
                          <h3>Enterprise Security</h3>
                          <p>Bank-level encryption and compliance with global data protection standards</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="why-choose-one__btn-and-client-box">
                <div className="why-choose-one__btn-box">
                  <a href="/signup" className="why-choose-one__btn thm-btn"><span className="icon-angles-right"></span>Start Free Trial</a>
                </div>
                <div className="why-choose-one__client-box">
                  <ul className="why-choose-one__client-img-list list-unstyled">
                    <li><img src="/fistudy-assets/images/resources/why-choose-one-client-img-1.jpg" alt="" /></li>
                    <li><img src="/fistudy-assets/images/resources/why-choose-one-client-img-2.jpg" alt="" /></li>
                    <li><img src="/fistudy-assets/images/resources/why-choose-one-client-img-3.jpg" alt="" /></li>
                  </ul>
                  <div className="why-choose-one__client-content">
                    <div className="why-choose-one__count-box">
                      <h3 className="odometer" data-count="1000">00</h3>
                      <span>+</span>
                    </div>
                    <p>Happy Companies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;

