import React from 'react';

const CounterSection: React.FC = () => {
  return (
    <section className="counter-one" id="metrics">
      <div className="counter-one__bg" style={{backgroundImage: 'url(/fistudy-assets/images/backgrounds/counter-one-bg.jpg)'}}>
        <div className="counter-one__video-link">
          <div className="counter-one__video-shape-1">
            <img src="/fistudy-assets/images/shapes/counter-one-video-shape-1.png" alt="" />
          </div>
          <a href="https://www.youtube.com/watch?v=Get7rqXYrbQ" className="video-popup">
            <div className="counter-one__video-icon">
              <span className="icon-play"></span>
              <i className="ripple"></i>
            </div>
          </a>
        </div>
      </div>
      <div className="counter-one__shape-1"
        style={{backgroundImage: 'url(/fistudy-assets/images/shapes/counter-one-shape-1.png)'}}></div>
      <div className="container">
        <div className="row">
          <div className="col-xl-8">
            <div className="counter-one__left">
              <ul className="counter-one__list list-unstyled">
                <li>
                  <div className="counter-one__count-hover-img"
                    style={{backgroundImage: 'url(/fistudy-assets/images/resources/counter-one-single-hover-img.jpg)'}}>
                  </div>
                  <div className="counter-one__count count-box">
                    <h3 className="count-text" data-stop="1000" data-speed="1500">00</h3>
                    <span>+</span>
                  </div>
                  <p>Companies Hiring</p>
                </li>
                <li>
                  <div className="counter-one__count-hover-img"
                    style={{backgroundImage: 'url(/fistudy-assets/images/resources/counter-one-single-hover-img.jpg)'}}>
                  </div>
                  <div className="counter-one__count count-box">
                    <h3 className="count-text" data-stop="50000" data-speed="1500">00</h3>
                    <span>+</span>
                  </div>
                  <p>Active Jobs</p>
                </li>
                <li>
                  <div className="counter-one__count-hover-img"
                    style={{backgroundImage: 'url(/fistudy-assets/images/resources/counter-one-single-hover-img.jpg)'}}>
                  </div>
                  <div className="counter-one__count count-box">
                    <h3 className="count-text" data-stop="98" data-speed="1500">00</h3>
                    <span>%</span>
                  </div>
                  <p>Satisfaction Rate</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounterSection;

