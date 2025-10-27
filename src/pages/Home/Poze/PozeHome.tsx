import React, { useEffect } from 'react';
import '../../../styles/klarus-homepage.css';
import '../../../utils/klarus-homepage.js';
import Preloader from './Preloader';
import PozeHeader from './PozeHeader';
import HeroSection from './HeroSection';
import FeaturedSection from './FeaturedSection';
import SoftwareFeaturesSection from './SoftwareFeaturesSection';
import UserFeatureSection from './UserFeatureSection';
import TestimonialSection from './TestimonialSection';
import BrandsSection from './BrandsSection';
import CTASection from './CTASection';
import FAQSection from './FAQSection';
import ContactSection from './ContactSection';
import PozeFooter from './PozeFooter';

const PozeHome: React.FC = () => {
  useEffect(() => {
    // The centralized JavaScript will handle all functionality
    // CSS is handled by klarus-homepage.css import
    
    console.log('🏠 PozeHome component mounted');
    
    // Cleanup function
    return () => {
      console.log('🏠 PozeHome component unmounted');
    };
  }, []);

  return (
    <>
      <Preloader />
      <PozeHeader />
      <div className="cs_content">
        <HeroSection />
        <FeaturedSection />
        <SoftwareFeaturesSection />
        <UserFeatureSection />
        <TestimonialSection />
        <BrandsSection />
        <CTASection />
        <FAQSection />
        <ContactSection />
      </div>
      <PozeFooter />
      <div id="cs_backtotop"><i className="fa-solid fa-arrow-up"></i></div>
    </>
  );
};

export default PozeHome;

