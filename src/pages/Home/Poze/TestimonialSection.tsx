import React from 'react';

const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director, TechCorp',
      review: 'Klarus HR has transformed our recruitment process completely. The AI-powered candidate matching has reduced our time-to-hire by 60% and improved the quality of our hires significantly. The platform is intuitive and the results speak for themselves.'
    },
    {
      name: 'Michael Chen',
      role: 'Talent Acquisition Manager, StartupXYZ',
      review: 'The automated screening and interview scheduling features have been game-changers for our startup. We can now focus on building relationships with candidates rather than getting bogged down in administrative tasks. Klarus HR is a must-have for any growing company.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of People, Enterprise Solutions Inc.',
      review: 'The predictive analytics feature has helped us make data-driven hiring decisions. We\'ve seen a 40% improvement in candidate quality and a significant reduction in turnover. The AI agent integration has also enhanced our candidate experience tremendously.'
    },
    {
      name: 'David Thompson',
      role: 'CEO, Recruitment Agency Pro',
      review: 'As a recruitment agency, we\'ve tried many platforms, but Klarus HR stands out. The LinkedIn integration and automated workflow features have tripled our efficiency. Our clients are consistently impressed with the quality of candidates we deliver.'
    },
    {
      name: 'Lisa Park',
      role: 'Freelance Recruiter',
      review: 'Klarus HR has made my freelance recruitment business incredibly efficient. The AI-powered candidate matching saves me hours of manual work, and the gamification features keep candidates engaged throughout the process. It\'s like having a full recruitment team at my fingertips.'
    },
    {
      name: 'James Wilson',
      role: 'VP of Talent, Global Tech Corp',
      review: 'The integration capabilities and predictive analytics have revolutionized our global hiring strategy. We\'ve reduced our recruitment costs by 35% while improving candidate quality. Klarus HR is the future of recruitment technology.'
    }
  ];

  return (
    <section id="testimonial">
      <div className="cs_height_143 cs_height_lg_75"></div>
      <div className="container">
        <div className="cs_section_heading cs_style_1 text-center">
          <p className="cs_section_subtitle cs_text_accent wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.2s">
            Klarus HR Testimonials
          </p>
          <h2 className="cs_section_title mb-0 wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
            What Our Clients Say About <br /> Our AI-Powered Recruitment Solutions
          </h2>
        </div>
        <div className="cs_height_85 cs_height_lg_60"></div>
      </div>
      <div className="cs_slider wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="cs_testimonial cs_style_1 cs_testimonial_item">
            <div className="cs_client_info">
              <div className="cs_client_meta">
                <h4 className="cs_client_name cs_testimonial_name">{testimonial.name}</h4>
                <p className="mb-0 cs_testimonial_role">{testimonial.role}</p>
              </div>
            </div>
            <p className="cs_client_review cs_testimonial_review">{testimonial.review}</p>
            <div className="cs_rating" data-rating="5">
              <div className="cs_rating_percentage"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="cs_height_143 cs_height_lg_75"></div>
    </section>
  );
};

export default TestimonialSection;

