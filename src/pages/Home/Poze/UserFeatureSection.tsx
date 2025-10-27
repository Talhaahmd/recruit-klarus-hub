import React from 'react';

const UserFeatureSection: React.FC = () => {
  const userTypes = [
    'Corporates',
    'Startups',
    'Enterprises',
    'Freelancers',
    'Recruitment Agencies',
    'HR Departments',
    'Talent Acquisition Teams',
    'And Many More..'
  ];

  return (
    <section className="cs_user_feature">
      <div className="container">
        <div className="row align-items-center cs_gap_y_40 cs_reverse_lg">
          <div className="col-xl-6 wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
            <div className="cs_section_heading cs_style_1">
              <p className="cs_section_subtitle cs_text_accent">Who Can Use Klarus</p>
              <h2 className="cs_section_title mb-0">Our AI Recruitment Platform for All Types of Organizations</h2>
            </div>
            <div className="cs_height_60 cs_height_lg_40"></div>
            <ul className="cs_list cs_style_1 cs_mp0">
              {userTypes.map((type, index) => (
                <li key={index} className="cs_user_feature_item">
                  <span className="cs_list_icon"><img src="/poze-assets/img/arrow.svg" alt="Icon" /></span>
                  <span className="cs_list_text cs_user_feature_text">{type}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-xl-6 wow fadeInRight" data-wow-duration="0.8s" data-wow-delay="0.2s">
            <div className="cs_feature_thumb_1 text-center">
              <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761248944/Untitled_design_1_csns8i.png" alt="Klarus HR AI Recruitment Features" />
            </div>
          </div>
        </div>
      </div>
      <div className="cs_height_150 cs_height_lg_80"></div>
    </section>
  );
};

export default UserFeatureSection;

