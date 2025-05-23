
import React, { useEffect, useRef } from 'react';
import LayoutGridDemo from '../../components/ui/layout-grid-demo';

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.75) {
        section.classList.add('opacity-100');
        section.classList.remove('opacity-0', 'translate-y-10');
      }

      featuresRef.current.forEach((feature, index) => {
        if (!feature) return;
        
        const featureTop = feature.getBoundingClientRect().top;
        
        if (featureTop < windowHeight * 0.85) {
          setTimeout(() => {
            feature.classList.add('opacity-100');
            feature.classList.remove('opacity-0', 'translate-y-10');
          }, index * 150);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 bg-gradient-to-b from-black to-gray-900 transition-all duration-1000 transform opacity-0 translate-y-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Features
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Supercharge Your Recruitment</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Our cutting-edge platform provides everything you need to streamline your hiring process
          </p>
        </div>

        <LayoutGridDemo />
      </div>
    </section>
  );
};

export default FeaturesSection;
