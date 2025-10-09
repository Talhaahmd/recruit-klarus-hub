import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "LinkedIn Recruiting",
      description: "Source and engage top talent directly from LinkedIn with AI-powered messaging",
      icon: "/fistudy-assets/images/icon/category-one-hover-icon-1-1.png"
    },
    {
      title: "ATS Integration",
      description: "Seamlessly connect with your existing Applicant Tracking System",
      icon: "/fistudy-assets/images/icon/category-one-hover-icon-1-1.png"
    },
    {
      title: "Interview Automation",
      description: "AI-powered scheduling and coordination for streamlined interviews",
      icon: "/fistudy-assets/images/icon/category-one-hover-icon-1-1.png"
    }
  ];

  return (
    <section className="courses-one" id="platforms">
      <div className="container">
        <div className="section-title text-center sec-title-animation animation-style1">
          <div className="section-title__tagline-box">
            <div className="section-title__tagline-shape"></div>
            <span className="section-title__tagline">Our Features</span>
          </div>
          <h2 className="section-title__title title-animation">Powerful Tools for Modern <br />
            <span>Recruitment <img src="/fistudy-assets/images/shapes/section-title-shape-1.png" alt="" /></span>
          </h2>
        </div>
        <div className="courses-one__carousel owl-theme owl-carousel">
          {features.map((feature, index) => (
            <div key={index} className="item">
              <div className="courses-one__single">
                <div className="courses-one__img-box">
                  <div className="courses-one__img">
                    <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1748548888/Screenshot_2025-05-30_010106_hdqfk2.png" alt={feature.title} />
                  </div>
                </div>
                <div className="courses-one__content">
                  <div className="courses-one__tag-and-meta">
                    <div className="courses-one__tag">
                      <span>AI-Powered</span>
                    </div>
                  </div>
                  <h3 className="courses-one__title"><a href="#platforms">{feature.title}</a></h3>
                  <p style={{padding: '15px 0'}}>{feature.description}</p>
                  <div className="courses-one__btn-and-doller-box">
                    <div className="courses-one__btn-box">
                      <a href="#contact" className="courses-one__btn thm-btn"><span className="icon-angles-right"></span>Learn More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

