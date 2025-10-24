import React from 'react';

const SoftwareFeaturesSection: React.FC = () => {
  const features = [
    {
      number: '01',
      title: 'AI-Powered Candidate Matching',
      description: 'Advanced algorithms analyze candidate profiles and job requirements to deliver the most suitable matches with unprecedented accuracy.'
    },
    {
      number: '02',
      title: 'Intelligent Screening',
      description: 'Automated resume screening and initial candidate assessment using natural language processing and machine learning.'
    },
    {
      number: '03',
      title: 'Predictive Analytics',
      description: 'Data-driven insights and predictive analytics to forecast hiring success and optimize recruitment strategies.'
    },
    {
      number: '04',
      title: 'Automated Workflow',
      description: 'Streamlined recruitment processes with automated scheduling, communication, and candidate management for maximum efficiency.'
    }
  ];

  return (
    <section>
      <div className="container">
        <div className="row align-items-center cs_gap_y_40">
          <div className="col-xl-6 wow fadeInLeft" data-wow-duration="0.8s" data-wow-delay="0.2s">
            <div className="cs_pr_45 text-center">
              <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1760138185/freepik__background__12895_vvm7uc.png" alt="Klarus HR AI Recruitment Platform" />
            </div>
          </div>
          <div className="col-xl-6 wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
            <div className="cs_section_heading cs_style_1">
              <p className="cs_section_subtitle cs_text_accent">About Klarus</p>
              <h2 className="cs_section_title mb-0">Transforming Recruitment with AI Innovation</h2>
            </div>
            <div className="cs_height_60 cs_height_lg_40"></div>
            <p className="cs_section_subtitle mb-4">
              We're dedicated to revolutionizing recruitment through cutting-edge AI technology, making hiring faster, smarter, and more efficient for companies worldwide. Our platform seamlessly connects top talent with outstanding opportunities.
            </p>
            <div className="row cs_gap_y_40">
              {features.map((feature, index) => (
                <div key={index} className="col-lg-6">
                  <div className="cs_iconbox cs_style_2">
                    <div className="cs_number_box cs_bg_accent cs_text_white">{feature.number}</div>
                    <h3 className="cs_iconbox_title">{feature.title}</h3>
                    <p className="cs_iconbox_subtitle">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="cs_height_150 cs_height_lg_75"></div>
    </section>
  );
};

export default SoftwareFeaturesSection;

