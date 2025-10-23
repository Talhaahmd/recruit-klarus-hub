import React, { useEffect } from 'react';
import FistudyHeader from './FistudyHeader';
import FistudyFooter from './FistudyFooter';
import BannerSection from './BannerSection';
import SlidingTextSection from './SlidingTextSection';
import CategorySection from './CategorySection';
import AboutSection from './AboutSection';
import WhyChooseSection from './WhyChooseSection';
import CounterSection from './CounterSection';
import TestimonialSection from './TestimonialSection';

const FistudyHome: React.FC = () => {
  useEffect(() => {
    // Initialize template scripts after component mount
    // The scripts are already loaded in index.html
    if (typeof window !== 'undefined' && (window as any).jQuery) {
      // Let the global script.js initialize plugins
      // This ensures carousels, counters, animations work
    }
  }, []);

  return (
    <div className="page-wrapper">
      <FistudyHeader />
      
      {/* Hero Banner */}
      <BannerSection />
      
      {/* Sliding Text Marquee */}
      <SlidingTextSection />
      
      {/* Categories/Solutions */}
      <CategorySection />
      
      {/* About Section */}
      <AboutSection />
      
      
      {/* Why Choose Us */}
      <WhyChooseSection />
      
      {/* Counter/Metrics */}
      <CounterSection />
      
      {/* Another Sliding Text */}
      <SlidingTextSection />
      
      {/* Testimonials */}
      <TestimonialSection />
      
      {/* Footer */}
      <FistudyFooter />
    </div>
  );
};

export default FistudyHome;
