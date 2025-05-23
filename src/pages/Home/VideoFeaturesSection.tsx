
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const VideoFeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const features = [
    {
      title: "AI-Powered Matching",
      description: "Our sophisticated AI algorithms match candidates with your job requirements with unparalleled precision, saving you time and ensuring better hires.",
      details: "Advanced machine learning models analyze candidate profiles, skills, experience, and cultural fit indicators to provide precise job-candidate matching. Our AI considers over 200+ data points including technical skills, soft skills, career trajectory, and company culture alignment to ensure optimal matches."
    },
    {
      title: "Smart Candidate Filtering",
      description: "Filter and sort candidates based on skills, experience, and cultural fit to find your perfect match in record time.",
      details: "Intelligent filtering system that allows you to quickly narrow down candidates using multiple criteria including technical skills, years of experience, education, location preferences, salary expectations, and cultural fit assessments. Save custom filter presets for recurring searches."
    },
    {
      title: "Recruiting Analytics",
      description: "Track your hiring pipeline with comprehensive analytics and reports to optimize your recruitment process and make data-driven decisions.",
      details: "Comprehensive dashboard providing insights into your recruitment funnel, time-to-hire metrics, source effectiveness, candidate quality scores, and hiring manager performance. Predictive analytics help forecast hiring needs and identify bottlenecks in your process."
    },
    {
      title: "Automated Interview Scheduling",
      description: "Streamline your interview process with automated scheduling and calendar integrations, making it easier to coordinate with candidates.",
      details: "Smart scheduling system that automatically coordinates between multiple stakeholders, sends calendar invites, manages time zones, and handles rescheduling. Integrates with Google Calendar, Outlook, and other major calendar platforms for seamless coordination."
    },
    {
      title: "Team Collaboration Tools",
      description: "Enable seamless collaboration between hiring managers, HR teams, and stakeholders with real-time feedback and decision-making tools.",
      details: "Collaborative workspace where team members can share candidate feedback, rate applications, discuss prospects in real-time, and make collective hiring decisions. Built-in communication tools and approval workflows ensure everyone stays aligned throughout the hiring process."
    },
    {
      title: "Advanced Reporting",
      description: "Generate detailed reports on your recruitment metrics, time-to-hire, and candidate quality to continuously improve your hiring process.",
      details: "Powerful reporting engine that generates customizable reports on key recruitment KPIs including cost-per-hire, source ROI, diversity metrics, and hiring funnel performance. Export reports in multiple formats and schedule automated delivery to stakeholders."
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
        const progress = Math.abs(rect.top) / (sectionHeight - viewportHeight);
        setScrollProgress(progress);
        
        // Show features when scrolled 20% into the section
        setShowFeatures(progress > 0.2);
      } else {
        setShowFeatures(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleFeature = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[300vh] bg-black"
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
        
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Glass Morphism Features Panel - Full Height, 45% Width from Right */}
        <div 
          className={`absolute right-0 top-0 w-[45%] h-full transition-all duration-1000 ${
            showFeatures ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          <div className="backdrop-blur-xl bg-black/30 border-l border-white/20 h-full flex flex-col">
            {/* Header Section */}
            <div className="p-8 pb-6">
              <h2 className="text-4xl font-bold text-white mb-4">Our Salient Features</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Discover our AI-powered solutions that transform your recruitment process
              </p>
            </div>
            
            {/* Features List - Scrollable */}
            <div className="flex-1 px-8 pb-8 overflow-y-auto">
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/15 hover:border-white/30"
                  >
                    <button
                      onClick={() => toggleFeature(index)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none group"
                    >
                      <h3 className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors">
                        {feature.title}
                      </h3>
                      {expandedFeature === index ? (
                        <ChevronUp className="w-6 h-6 text-gray-300 flex-shrink-0 transition-transform" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-300 flex-shrink-0 transition-transform" />
                      )}
                    </button>
                    
                    {expandedFeature === index && (
                      <div className="px-6 pb-5 animate-accordion-down">
                        <div className="border-t border-white/20 pt-4 space-y-3">
                          <p className="text-gray-200 text-base leading-relaxed">
                            {feature.description}
                          </p>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {feature.details}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFeaturesSection;
