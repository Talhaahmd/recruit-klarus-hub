import React from 'react';

const FeaturedSection: React.FC = () => {
  const features = [
    {
      icon: '/poze-assets/img/shop.svg',
      title: 'LinkedIn Recruiting',
      description: 'Source & engage talent with advanced LinkedIn automation tools that help you find and connect with the right candidates.'
    },
    {
      icon: '/poze-assets/img/price_bar.svg',
      title: 'ATS Integration',
      description: 'Seamless workflow integration with your existing ATS systems for streamlined candidate management and tracking.'
    },
    {
      icon: '/poze-assets/img/setup.svg',
      title: 'Interview Automation',
      description: 'AI-powered scheduling and interview coordination that automates the entire interview process for maximum efficiency.'
    },
    {
      icon: '/poze-assets/img/ui.svg',
      title: 'AI Agent & Gamification',
      description: 'Engage & convert candidates with intelligent AI agents and gamified recruitment experiences that boost engagement.'
    }
  ];

  return (
    <section className="cs_business_feature position-relative" id="features">
      <div className="cs_height_143 cs_height_lg_75"></div>
      <div className="container">
        <div className="cs_section_heading cs_style_1 text-center">
          <p className="cs_section_subtitle cs_text_accent wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.2s">
            Transform Your Hiring Process with AI-Powered Tools
          </p>
          <h2 className="cs_section_title mb-0 wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
            Delightfully Simple And Deceptively <br /> Our LinkedIn Recruiting Platform
          </h2>
        </div>
        <div className="cs_height_85 cs_height_lg_60"></div>
        <div className="row cs_gap_y_30 wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-6 col-xl-3">
              <div className="cs_iconbox cs_style_1 cs_type_1">
                <div className="cs_iconbox_icon">
                  <img src={feature.icon} alt="Icon" />
                </div>
                <h3 className="cs_iconbox_title">{feature.title}</h3>
                <p className="cs_iconbox_subtitle">{feature.description}</p>
                <a href="#" className="cs_text_btn cs_text_accent">
                  Learn More
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.147 1.75739C10.147 1.28795 9.76649 0.907395 9.29705 0.907394L1.64705 0.907394C1.17761 0.907395 0.797048 1.28795 0.797048 1.75739C0.797048 2.22684 1.17761 2.60739 1.64705 2.60739H8.44705V9.4074C8.44705 9.87684 8.82761 10.2574 9.29705 10.2574C9.76649 10.2574 10.147 9.87684 10.147 9.4074L10.147 1.75739ZM1.41281 10.8437L9.89809 2.35844L8.69601 1.15635L0.210727 9.64163L1.41281 10.8437Z" fill="currentColor"></path>
                  </svg>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.147 1.75739C10.147 1.28795 9.76649 0.907395 9.29705 0.907394L1.64705 0.907394C1.17761 0.907395 0.797048 1.28795 0.797048 1.75739C0.797048 2.22684 1.17761 2.60739 1.64705 2.60739H8.44705V9.4074C8.44705 9.87684 8.82761 10.2574 9.29705 10.2574C9.76649 10.2574 10.147 9.87684 10.147 9.4074L10.147 1.75739ZM1.41281 10.8437L9.89809 2.35844L8.69601 1.15635L0.210727 9.64163L1.41281 10.8437Z" fill="currentColor"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="cs_featured_shape">
          <img src="/poze-assets/img/Vector.svg" alt="Image" />
        </div>
      </div>
      <div className="cs_height_150 cs_height_lg_80"></div>
    </section>
  );
};

export default FeaturedSection;

