import React, { useEffect } from 'react';
import './poze-fixes.css';
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
    // Add Poze-specific styles to fix visual issues with maximum specificity
    const style = document.createElement('style');
    style.textContent = `
      /* Force header styling with maximum specificity */
      header.cs_site_header,
      .cs_site_header.cs_style_1,
      .cs_site_header.cs_version_5,
      .cs_site_header.cs_sticky_header,
      .cs_site_header.cs_medium {
        background-color: white !important;
        background: white !important;
        color: black !important;
      }
      
      .cs_site_header .cs_nav_list a,
      .cs_site_header .cs_nav_list li a,
      .cs_site_header .cs_nav_list,
      .cs_site_header .cs_nav_list li,
      .cs_site_header .cs_header_text_btn {
        color: black !important;
      }
      
      .cs_main_header,
      .cs_main_header_in {
        background-color: white !important;
        background: white !important;
      }
      
      /* Fix body text */
      body {
        background-color: white !important;
        color: black !important;
      }
      
      /* Fix footer */
      .cs_site_footer {
        background-color: #f8f9fa !important;
        color: black !important;
      }
      .cs_site_footer * {
        color: black !important;
      }
      
      /* Fix "Who can use Klarus" section */
      .cs_user_feature .cs_list_text,
      .cs_user_feature .cs_list li {
        color: black !important;
      }
      
      /* Fix testimonial section */
      .cs_testimonial .cs_client_name,
      .cs_testimonial .cs_client_sub-title,
      .cs_testimonial .cs_client_review,
      .cs_testimonial h4,
      .cs_testimonial p {
        color: black !important;
      }
      
      /* Ensure text is readable */
      .cs_hero_title,
      .cs_hero_subtitle,
      .cs_section_title,
      .cs_section_subtitle,
      .cs_iconbox_title,
      .cs_iconbox_subtitle {
        color: black !important;
      }
      
      /* Fix button styling */
      .cs_btn {
        background-color: #2563eb !important;
        color: white !important;
        border: none !important;
        padding: 10px 20px !important;
        border-radius: 5px !important;
      }
      
      /* Force all text to be black */
      * {
        color: black !important;
      }
      
      /* Override any white text */
      .cs_text_white {
        color: black !important;
      }
    `;
    document.head.appendChild(style);

    // Load Poze CSS files
    const cssFiles = [
      '/poze-assets/css/bootstrap.min.css',
      '/poze-assets/css/fontawesome.min.css',
      '/poze-assets/css/slick.css',
      '/poze-assets/css/animate.css',
      '/poze-assets/css/style.css'
    ];

    const linkElements: HTMLLinkElement[] = [];

    cssFiles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      linkElements.push(link);
    });

    // Load Poze JS files
    const jsFiles = [
      '/poze-assets/js/jquery.min.js',
      '/poze-assets/js/jquery.slick.min.js',
      '/poze-assets/js/wow.min.js',
      '/poze-assets/js/main.js'
    ];

    const scriptElements: HTMLScriptElement[] = [];

    jsFiles.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      document.body.appendChild(script);
      scriptElements.push(script);
    });

    // Cleanup function
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      linkElements.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
      scriptElements.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
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

