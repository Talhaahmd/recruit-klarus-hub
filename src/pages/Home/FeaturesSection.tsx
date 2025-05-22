
import React, { useEffect, useRef } from 'react';
import { Motion, Presence } from '@motionone/dom';

const features = [
  {
    icon: "✨",
    title: "AI-Powered Matching",
    description: "Our sophisticated AI algorithms match candidates with your job requirements with unparalleled precision."
  },
  {
    icon: "🔍",
    title: "Smart Candidate Filtering",
    description: "Filter and sort candidates based on skills, experience, and cultural fit to find your perfect match."
  },
  {
    icon: "📈",
    title: "Recruiting Analytics",
    description: "Track your hiring pipeline with comprehensive analytics and reports to optimize your recruitment process."
  },
  {
    icon: "📝",
    title: "Automated Interview Scheduling",
    description: "Streamline your interview process with automated scheduling and calendar integrations."
  }
];

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
        <div className="text-center mb-20">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Features
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Supercharge Your Recruitment</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Our cutting-edge platform provides everything you need to streamline your hiring process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featuresRef.current[index] = el)}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl transform transition-all duration-700 opacity-0 translate-y-10 hover:scale-105 border border-gray-700 hover:border-cyan-500/50 group"
            >
              <div className="text-4xl mb-6 bg-gradient-to-br from-cyan-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-500">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl -z-10 rounded-xl"></div>
          <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl p-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">Revolutionize Your Hiring Process</h3>
              <p className="text-gray-400 mb-6">
                Our AI-powered platform helps you find the perfect candidates faster, reducing time-to-hire and improving the quality of your hires.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-4 flex items-center gap-3 min-w-32">
                  <div className="text-cyan-500 font-bold text-4xl">85%</div>
                  <div className="text-sm text-gray-400">Faster hiring process</div>
                </div>
                <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-4 flex items-center gap-3 min-w-32">
                  <div className="text-purple-500 font-bold text-4xl">93%</div>
                  <div className="text-sm text-gray-400">Better candidate matches</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-md -z-10 rounded-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Recruitment Dashboard" 
                className="rounded-xl shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
