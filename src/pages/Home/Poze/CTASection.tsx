import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section>
      <div className="container">
        <div className="cs_cta cs_style_1 text-center position-relative">
          <div className="cs_cta_in">
            <div className="cs_section_heading cs_style_1">
              <h2 className="cs_section_title cs_text_white">
                Transform Your Recruitment with <br /> Klarus HR AI-Powered Solutions!
              </h2>
              <p className="cs_section_subtitle mb-0">
                Experience the future of hiring! Schedule a demo today and witness how <br /> our AI recruitment platform can revolutionize your talent acquisition.
              </p>
            </div>
            <div className="cs_btn_group text-center">
              <a href="#" aria-label="Start trial button" className="cs_btn cs_type_1 cs_bg_white">Get Started Free</a>
              <a href="#" aria-label="Schedule demo button" className="cs_btn cs_type_1 cs_bg_accent">Schedule Demo</a>
            </div>
          </div>
          <div className="cs_cta_shape1">
            <img src="/poze-assets/img/Ellipse_small.svg" alt="Image" />
          </div>
          <div className="cs_cta_shape2">
            <img src="/poze-assets/img/stroke.svg" alt="Image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

