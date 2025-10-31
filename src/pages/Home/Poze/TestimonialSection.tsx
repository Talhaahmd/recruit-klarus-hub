import React, { useEffect, useRef, useState } from 'react';

const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director, TechCorp',
      review:
        'Klarus HR has transformed our recruitment process completely. The AI-powered candidate matching has reduced our time-to-hire by 60% and improved the quality of our hires significantly. The platform is intuitive and the results speak for themselves.',
    },
    {
      name: 'Michael Chen',
      role: 'Talent Acquisition Manager, StartupXYZ',
      review:
        'The automated screening and interview scheduling features have been game-changers for our startup. We can now focus on building relationships with candidates rather than getting bogged down in administrative tasks. Klarus HR is a must-have for any growing company.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of People, Enterprise Solutions Inc.',
      review:
        "The predictive analytics feature has helped us make data-driven hiring decisions. We've seen a 40% improvement in candidate quality and a significant reduction in turnover. The AI agent integration has also enhanced our candidate experience tremendously.",
    },
    {
      name: 'David Thompson',
      role: 'CEO, Recruitment Agency Pro',
      review:
        "As a recruitment agency, we've tried many platforms, but Klarus HR stands out. The LinkedIn integration and automated workflow features have tripled our efficiency. Our clients are consistently impressed with the quality of candidates we deliver.",
    },
    {
      name: 'Lisa Park',
      role: 'Freelance Recruiter',
      review:
        "Klarus HR has made my freelance recruitment business incredibly efficient. The AI-powered candidate matching saves me hours of manual work, and the gamification features keep candidates engaged throughout the process. It's like having a full recruitment team at my fingertips.",
    },
    {
      name: 'James Wilson',
      role: 'VP of Talent, Global Tech Corp',
      review:
        "The integration capabilities and predictive analytics have revolutionized our global hiring strategy. We've reduced our recruitment costs by 35% while improving candidate quality. Klarus HR is the future of recruitment technology.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  // Compute slides per view responsively
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w >= 1200) return 3;
      if (w >= 768) return 2;
      return 1;
    };
    const apply = () => {
      const spv = compute();
      setSlidesPerView(spv);
      // Keep index in bounds when resizing
      setCurrentIndex((idx) => {
        const maxIdx = Math.max(0, testimonials.length - spv);
        return Math.min(idx, maxIdx);
      });
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [testimonials.length]);

  const goTo = (index: number) => {
    const maxIdx = Math.max(0, testimonials.length - slidesPerView);
    if (index < 0) {
      setCurrentIndex(maxIdx);
    } else if (index > maxIdx) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  // Autoplay every 5s, pause on hover
  useEffect(() => {
    if (isHovering) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => {
        const maxIdx = Math.max(0, testimonials.length - slidesPerView);
        return i >= maxIdx ? 0 : i + 1;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [isHovering, testimonials.length, slidesPerView]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex]);

  // Touch handlers for swipe
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    const threshold = 50; // px
    if (touchDeltaX.current > threshold) {
      prev();
    } else if (touchDeltaX.current < -threshold) {
      next();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const totalPages = Math.max(1, Math.ceil(testimonials.length - slidesPerView + 1));
  const activePage = Math.min(currentIndex, totalPages - 1);

  return (
    <section id="testimonial">
      <div className="cs_height_143 cs_height_lg_75"></div>
      <div className="container">
        <div className="cs_section_heading cs_style_1 text-center">
          <p
            className="cs_section_subtitle cs_text_accent wow fadeInUp"
            data-wow-duration="0.8s"
            data-wow-delay="0.2s"
          >
            Klarus HR Testimonials
          </p>
          <h2
            className="cs_section_title mb-0 wow fadeIn"
            data-wow-duration="0.8s"
            data-wow-delay="0.2s"
          >
            What Our Clients Say About <br /> Our AI-Powered Recruitment Solutions
          </h2>
        </div>
        <div className="cs_height_85 cs_height_lg_60"></div>
      </div>

      <div
        className="cs_testimonial_carousel wow fadeIn"
        data-wow-duration="0.8s"
        data-wow-delay="0.2s"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-roledescription="carousel"
        aria-label="Testimonials"
      >
        <div
          className="cs_testimonial_track"
          ref={trackRef}
          style={{
            transform: `translateX(-${(100 / slidesPerView) * currentIndex}%)`,
            // Expose slides-per-view to CSS
            // @ts-ignore - CSS var type
            '--spv': slidesPerView,
          } as React.CSSProperties}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {testimonials.map((t, index) => (
            <div
              className="cs_testimonial_slide"
              key={index}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${testimonials.length}`}
            >
              <div className="cs_testimonial cs_style_1">
                <div className="cs_client_info">
                  <div className="cs_client_meta">
                    <h4 className="cs_client_name">{t.name}</h4>
                    <p className="mb-0">{t.role}</p>
                  </div>
                </div>
                <p className="cs_client_review">{t.review}</p>
                <div className="cs_rating" data-rating="5">
                  <div className="cs_rating_percentage"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="cs_carousel_nav cs_prev"
          aria-label="Previous testimonial"
          onClick={prev}
        >
          <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          className="cs_carousel_nav cs_next"
          aria-label="Next testimonial"
          onClick={next}
        >
          <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>

        <div className="cs_carousel_dots" role="tablist" aria-label="Testimonial pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activePage}
              aria-label={`Go to slide ${i + 1}`}
              className={`cs_carousel_dot ${i === activePage ? 'cs_active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      <div className="cs_height_143 cs_height_lg_75"></div>
    </section>
  );
};

export default TestimonialSection;

