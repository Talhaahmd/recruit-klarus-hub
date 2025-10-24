import React, { useState } from 'react';

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const faqs = [
    {
      question: 'How Does Klarus HR\'s AI Technology Improve Recruitment?',
      answer: 'Klarus HR uses advanced AI algorithms to automate candidate screening, match job requirements with candidate profiles, and predict hiring success. This reduces time-to-hire by up to 60%, improves candidate quality, and eliminates unconscious bias in the recruitment process.'
    },
    {
      question: 'Can Klarus HR Integrate with Our Existing ATS and HR Systems?',
      answer: 'Yes, Klarus HR seamlessly integrates with popular ATS systems like Workday, BambooHR, Greenhouse, and many others. Our API-first approach ensures smooth data synchronization, automated workflows, and unified candidate management across all your recruitment tools.'
    },
    {
      question: 'Is Klarus HR Easy to Use for Non-Technical HR Teams?',
      answer: 'Absolutely! Klarus HR features an intuitive, user-friendly interface designed for HR professionals of all technical levels. We provide comprehensive onboarding, training materials, and 24/7 support. Most teams are fully operational within the first week of implementation.'
    },
    {
      question: 'What Analytics and Insights Does Klarus HR Provide?',
      answer: 'Klarus HR provides comprehensive recruitment analytics including time-to-hire metrics, candidate pipeline analysis, source effectiveness, diversity insights, and predictive hiring success rates. Our dashboard offers real-time reporting and actionable insights to optimize your recruitment strategy.'
    },
    {
      question: 'How Do I Get Started with Klarus HR?',
      answer: 'Getting started with Klarus HR is simple! Contact our team for a personalized demo, discuss your specific recruitment needs, and we\'ll create a tailored implementation plan. We offer free trials, comprehensive onboarding, and dedicated support to ensure your success from day one.'
    }
  ];

  return (
    <section className="cs_faq_wrap position-relative" id="faq">
      <div className="cs_height_143 cs_height_lg_75"></div>
      <div className="container">
        <div className="cs_section_heading cs_style_1 text-center">
          <p className="cs_section_subtitle cs_text_accent wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.2s">
            Klarus HR FAQ
          </p>
          <h2 className="cs_section_title mb-0 wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
            Frequently Asked Questions About <br /> Our AI Recruitment Platform
          </h2>
        </div>
        <div className="cs_height_85 cs_height_lg_60"></div>
        <div className="row wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
          <div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
            <div className="cs_accordian_wrap">
              {faqs.map((faq, index) => (
                <div key={index} className={`cs_accordian ${activeIndex === index ? 'active' : ''}`}>
                  <h2 className="cs_accordian_title" onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}>
                    {faq.question}
                    <span className="cs_accordian_toggle">
                      <span></span>
                    </span>
                  </h2>
                  <div className="cs_accordian_body">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="cs_faq_shape1"></div>
      <div className="cs_faq_shape2"></div>
      <div className="cs_height_150 cs_height_lg_75"></div>
    </section>
  );
};

export default FAQSection;

