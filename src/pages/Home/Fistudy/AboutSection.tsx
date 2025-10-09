import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="about-one" id="about">
      <div className="about-one__shape-1">
        <img src="/fistudy-assets/images/shapes/about-one-shape-1.png" alt="" />
      </div>
      <div className="about-one__shape-2">
        <img src="/fistudy-assets/images/shapes/about-one-shape-2.png" alt="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-6 wow slideInLeft" data-wow-delay="100ms" data-wow-duration="2500ms">
            <div className="about-one__left">
              <div className="about-one__left-shape-1 rotate-me"></div>
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6">
                  <div className="about-one__img-box">
                    <div className="about-one__img">
                      <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1748548888/Screenshot_2025-05-30_010106_hdqfk2.png" alt="Klarus Platform" />
                    </div>
                  </div>
                  <div className="about-one__awards-box">
                    <div className="about-one__awards-count-box">
                      <h3 className="odometer" data-count="50">00</h3>
                      <span>+</span>
                    </div>
                    <p>Industry Awards</p>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6">
                  <div className="about-one__experience-box">
                    <div className="about-one__experience-box-inner">
                      <div className="about-one__experience-icon">
                        <img src="/fistudy-assets/images/icon/about-one-experience-icon.png" alt="" />
                      </div>
                      <div className="about-one__experience-count-box">
                        <div className="about-one__experience-count">
                          <h3 className="odometer" data-count="10">00</h3>
                          <span>+</span>
                          <p>Years</p>
                        </div>
                        <p>of excellence</p>
                      </div>
                    </div>
                    <div className="about-one__experience-box-shape"></div>
                  </div>
                  <div className="about-one__img-box-2">
                    <div className="about-one__img-2">
                      <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1748548888/Screenshot_2025-05-30_010106_hdqfk2.png" alt="Klarus Analytics" />
                    </div>
                    <div className="about-one__img-shape-1 float-bob-y">
                      <img src="/fistudy-assets/images/shapes/about-one-img-shape-1.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="about-one__right">
              <div className="section-title text-left sec-title-animation animation-style2">
                <div className="section-title__tagline-box">
                  <div className="section-title__tagline-shape"></div>
                  <span className="section-title__tagline">About Klarus</span>
                </div>
                <h2 className="section-title__title title-animation">Transforming Recruitment with
                  <span>AI Innovation <img src="/fistudy-assets/images/shapes/section-title-shape-1.png" alt="" /></span>
                </h2>
              </div>
              <p className="about-one__text">We're dedicated to revolutionizing recruitment through cutting-edge AI technology, making hiring faster, smarter, and more efficient for companies worldwide. Our platform seamlessly connects top talent with outstanding opportunities.</p>
              <ul className="about-one__mission-and-vision list-unstyled">
                <li>
                  <div className="about-one__icon-and-title">
                    <div className="about-one__icon">
                      <img src="/fistudy-assets/images/icon/mission-icon.png" alt="" />
                    </div>
                    <h3>Our Mission:</h3>
                  </div>
                  <p className="about-one__mission-and-vision-text">To empower companies with AI-powered recruitment solutions that streamline hiring, reduce time-to-hire, and improve candidate quality through intelligent matching.</p>
                </li>
                <li>
                  <div className="about-one__icon-and-title">
                    <div className="about-one__icon">
                      <img src="/fistudy-assets/images/icon/vision-icon.png" alt="" />
                    </div>
                    <h3>Our Vision</h3>
                  </div>
                  <p className="about-one__mission-and-vision-text">To become the world's leading AI recruitment platform, transforming how companies discover, engage, and hire exceptional talent globally.</p>
                </li>
              </ul>
              <div className="about-one__btn-and-live-class">
                <div className="about-one__btn-box">
                  <a href="#solutions" className="about-one__btn thm-btn"><span className="icon-angles-right"></span>Explore Solutions</a>
                </div>
                <h3 className="about-one__live-class">AI-Powered <img src="/fistudy-assets/images/shapes/live-class-shape-1.png" alt="" /></h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

