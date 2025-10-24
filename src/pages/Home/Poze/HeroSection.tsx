import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="cs_hero cs_style_1 cs_type_1 position-relative" id="home">
      <div className="cs_hero_bg_shape">
        <img src="/poze-assets/img/hero_bg6.jpg" alt="Hero background image" />
      </div>
      <div className="container position-relative z-2">
        <div className="cs_hero_text text-center">
          <h1 className="cs_hero_title cs_text_white wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.2s">
            Fullstack Linkedin Developer
          </h1>
          <p className="cs_hero_subtitle cs_fs_21 cs_semibold cs_white_color wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.25s">
            Everything for rapid growth on LinkedIn, hiring and recruitment
          </p>
        </div>
        <div className="cs_btn_group text-center wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.25s">
          <a href="#" aria-label="Optimize my LinkedIn" className="cs_btn cs_type_1 cs_bg_white" style={{ color: '#2563eb' }}>
            Optimize my LinkedIn
          </a>
        </div>
        <div className="cs_height_107 cs_height_lg_60"></div>
        <div className="cs_hero_img wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.25s">
          <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761247770/freepik__background__15090_zngew8.png" alt="Klarus HR AI Recruitment Platform" />
        </div>
      </div>
      <div className="cs_hero_shape4"><img src="/poze-assets/img/polygon-3.svg" alt="Polygon Icon" /></div>
      <div className="cs_hero_shape5"><img src="/poze-assets/img/polygon-2.svg" alt="Polygon Icon" /></div>
    </section>
  );
};

export default HeroSection;

