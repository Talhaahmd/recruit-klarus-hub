import React, { useEffect, useRef, useState } from 'react';

const TestimonialSection: React.FC = () => {
  const testimonials = [
    { name: 'Sarah Johnson', role: 'HR Director, TechCorp', review: 'Klarus HR has transformed our recruitment process completely. The AI-powered candidate matching has reduced our time-to-hire by 60% and improved the quality of our hires significantly. The platform is intuitive and the results speak for themselves.' },
    { name: 'Michael Chen', role: 'Talent Acquisition Manager, StartupXYZ', review: 'The automated screening and interview scheduling features have been game-changers for our startup. We can now focus on building relationships with candidates rather than getting bogged down in administrative tasks. Klarus HR is a must-have for any growing company.' },
    { name: 'Emily Rodriguez', role: 'Head of People, Enterprise Solutions Inc.', review: "The predictive analytics feature has helped us make data-driven hiring decisions. We've seen a 40% improvement in candidate quality and a significant reduction in turnover. The AI agent integration has also enhanced our candidate experience tremendously." },
    { name: 'David Thompson', role: 'CEO, Recruitment Agency Pro', review: "As a recruitment agency, we've tried many platforms, but Klarus HR stands out. The LinkedIn integration and automated workflow features have tripled our efficiency. Our clients are consistently impressed with the quality of candidates we deliver." },
    { name: 'Lisa Park', role: 'Freelance Recruiter', review: "Klarus HR has made my freelance recruitment business incredibly efficient. The AI-powered candidate matching saves me hours of manual work, and the gamification features keep candidates engaged throughout the process. It's like having a full recruitment team at my fingertips." },
    { name: 'James Wilson', role: 'VP of Talent, Global Tech Corp', review: "The integration capabilities and predictive analytics have revolutionized our global hiring strategy. We've reduced our recruitment costs by 35% while improving candidate quality. Klarus HR is the future of recruitment technology." },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Compute slides per view responsively
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w >= 1200) return 3;
      if (w >= 768) return 2;
      return 1;
    };
    const apply = () => setSlidesPerView(compute());
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  // Update index on scroll using scrollLeft
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const firstSlide = el.querySelector('.cs_testimonial_slide') as HTMLElement | null;
      if (!firstSlide) return;
      const slideWidth = firstSlide.clientWidth; // includes margin due to box-sizing rules
      if (slideWidth <= 0) return;
      const i = Math.round(el.scrollLeft / slideWidth);
      setCurrentIndex(Math.max(0, Math.min(i, testimonials.length - 1)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [testimonials.length, slidesPerView]);

  const centerIndex = currentIndex + Math.floor(slidesPerView / 2);
  const classify = (index: number) => {
    const dist = Math.abs(index - centerIndex);
    if (dist === 0) return 'cs_center';
    if (dist === 1) return 'cs_near';
    return '';
  };

  return (
    <section id="testimonial">
      <div className="cs_height_143 cs_height_lg_75"></div>
      <div className="container">
        <div className="cs_section_heading cs_style_1 text-center">
          <p className="cs_section_subtitle cs_text_accent wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.2s">Klarus HR Testimonials</p>
          <h2 className="cs_section_title mb-0 wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
            What Our Clients Say About <br /> Our AI-Powered Recruitment Solutions
          </h2>
        </div>
        <div className="cs_height_85 cs_height_lg_60"></div>
      </div>

      <div
        ref={wrapperRef}
        className="cs_testimonial_carousel cs_scroll_mode wow fadeIn"
        data-wow-duration="0.8s"
        data-wow-delay="0.2s"
        aria-roledescription="carousel"
        aria-label="Testimonials"
      >
        <div
          className="cs_testimonial_track"
          ref={trackRef}
          style={{ ['--spv' as any]: String(slidesPerView) } as React.CSSProperties}
        >
          {testimonials.map((t, index) => (
            <div className={`cs_testimonial_slide ${classify(index)}`} key={index} aria-roledescription="slide" aria-label={`${index + 1} of ${testimonials.length}`}>
              <div className="cs_testimonial cs_style_1">
                <div className="cs_client_info">
                  <div className="cs_client_meta">
                    <h4 className="cs_client_name">{t.name}</h4>
                    <p className="mb-0">{t.role}</p>
                  </div>
                </div>
                <p className="cs_client_review">{t.review}</p>
                <div className="cs_rating" data-rating="5"><div className="cs_rating_percentage"></div></div>
              </div>
            </div>
          ))}
        </div>

        <div className="cs_carousel_dots" role="tablist" aria-label="Testimonial pagination">
          {Array.from({ length: Math.max(1, Math.ceil(testimonials.length - slidesPerView + 1)) }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to slide ${i + 1}`}
              className={`cs_carousel_dot ${i === currentIndex ? 'cs_active' : ''}`}
              onClick={() => {
                const el = trackRef.current;
                const firstSlide = el?.querySelector('.cs_testimonial_slide') as HTMLElement | null;
                if (el && firstSlide) {
                  const slideWidth = firstSlide.clientWidth;
                  el.scrollTo({ left: i * slideWidth, behavior: 'smooth' });
                }
              }}
            />
          ))}
        </div>
      </div>

      <div className="cs_height_143 cs_height_lg_75"></div>
    </section>
  );
};

export default TestimonialSection;

