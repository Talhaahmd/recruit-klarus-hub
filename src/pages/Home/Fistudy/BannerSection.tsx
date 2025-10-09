import React from 'react';
import { Link } from 'react-router-dom';

const BannerSection: React.FC = () => {
  return (
    <section className="banner-one">
      <div className="banner-one__bg-shape-1"
        style={{backgroundImage: 'url(/fistudy-assets/images/shapes/banner-one-bg-shape-1.png)'}}></div>
      <div className="banner-one__icon-1 img-bounce">
        <img src="/fistudy-assets/images/icon/idea-bulb.png" alt="" />
      </div>
      <div className="banner-one__icon-2 float-bob-x">
        <img src="/fistudy-assets/images/icon/3d-alarm.png" alt="" />
      </div>
      <div className="banner-one__icon-3 float-bob-y">
        <img src="/fistudy-assets/images/icon/linke-icon.png" alt="" />
      </div>
      <div className="banner-one__shape-4 float-bob-x">
        <img src="/fistudy-assets/images/shapes/banner-one-shape-4.png" alt="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="banner-one__left">
              <div className="banner-one__title-box">
                <div className="banner-one__title-box-shape">
                  <img src="/fistudy-assets/images/shapes/banner-one-title-box-shape-1.png" alt="" />
                </div>
                <h2 className="banner-one__title" style={{color: '#000'}}>
                  Everything for rapid growth on <br />
                  <span className="banner-one__title-clr-1" style={{color: '#000'}}>LinkedIn</span>, hiring and <br />
                  <span className="banner-one__title-clr-2" style={{color: '#000'}}>recruitment</span>
                </h2>
              </div>
              <p className="banner-one__text">Easy-to-use solutions to drive career and business growth with AI chatbots, automated hiring workflows, and intelligent candidate engagement</p>
              <div className="banner-one__thm-and-other-btn-box">
                <div className="banner-one__btn-box">
                  <Link to="/signup" className="thm-btn"><span className="icon-angles-right"></span>Get Started Free</Link>
                </div>
                <div className="banner-one__other-btn-box">
                  <Link to="/demo" className="banner-one__other-btn-1"><span className="icon-thumbs-up"></span>Book a Demo</Link>
                </div>
              </div>
              <p className="banner-one__text" style={{marginTop: '20px', fontSize: '14px'}}>14-day free trial • No credit card required • Setup in 2 minutes</p>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="banner-one__right">
              <div className="banner-one__img-box">
                <div className="banner-one__img">
                  <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1748548888/Screenshot_2025-05-30_010106_hdqfk2.png" alt="Klarus HR Dashboard" />
                  <div className="banner-one__img-shape-box rotate-me">
                    <div className="banner-one__img-shape-1">
                      <div className="banner-one__img-shape-2"></div>
                    </div>
                    <div className="banner-one__shape-1">
                      <img src="/fistudy-assets/images/shapes/banner-one-shape-1.png" alt="" />
                    </div>
                    <div className="banner-one__shape-2 rotate-me">
                      <img src="/fistudy-assets/images/shapes/banner-one-shape-2.png" alt="" />
                    </div>
                    <div className="banner-one__shape-3">
                      <img src="/fistudy-assets/images/shapes/banner-one-shape-3.png" alt="" />
                    </div>
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

export default BannerSection;
