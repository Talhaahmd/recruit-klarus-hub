
import React, { useEffect, useRef, useState } from 'react';

const VideoFeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      title: "AI-Powered Matching",
      description: "Our sophisticated AI algorithms match candidates with your job requirements with unparalleled precision, saving you time and ensuring better hires."
    },
    {
      title: "Smart Candidate Filtering",
      description: "Filter and sort candidates based on skills, experience, and cultural fit to find your perfect match in record time."
    },
    {
      title: "Recruiting Analytics",
      description: "Track your hiring pipeline with comprehensive analytics and reports to optimize your recruitment process and make data-driven decisions."
    },
    {
      title: "Automated Interview Scheduling",
      description: "Streamline your interview process with automated scheduling and calendar integrations, making it easier to coordinate with candidates."
    },
    {
      title: "Team Collaboration Tools",
      description: "Enable seamless collaboration between hiring managers, HR teams, and stakeholders with real-time feedback and decision-making tools."
    },
    {
      title: "Advanced Reporting",
      description: "Generate detailed reports on your recruitment metrics, time-to-hire, and candidate quality to continuously improve your hiring process."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress within the section
      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        const scrollProgress = Math.abs(rect.top) / (sectionHeight - viewportHeight);
        const featureIndex = Math.min(Math.floor(scrollProgress * features.length), features.length - 1);
        setCurrentFeature(featureIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [features.length]);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[600vh] bg-black"
    >
      {/* Fixed Video Background */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://res.cloudinary.com/dt3ufcdjs/video/upload/v1747877160/Final_Comp_cnp4bl.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* Feature Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase mb-4 block">
                Features
              </span>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {features[currentFeature].title}
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {features[currentFeature].description}
              </p>
              
              {/* Feature Progress Indicator */}
              <div className="mt-12 flex justify-center space-x-3">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentFeature 
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500' 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              {/* Feature Counter */}
              <div className="mt-6 text-cyan-400 font-medium">
                {currentFeature + 1} / {features.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFeaturesSection;
