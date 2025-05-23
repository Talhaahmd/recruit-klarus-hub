
import React, { useEffect, useRef, useState } from 'react';

const VideoFeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

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

  const closeFeatureDetail = () => {
    setSelectedFeature(null);
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
        
        {/* Features List on Right Side */}
        <div 
          className={`absolute right-0 top-0 h-full w-1/2 flex items-center justify-center transition-all duration-1000 ${
            showFeatures ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-8 max-w-lg w-full mx-8">
            <h2 className="text-3xl font-bold text-white mb-2">Our Salient Features</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Discover our AI-powered solutions that transform your recruitment process
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="border border-gray-600 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:border-cyan-500 hover:bg-white hover:bg-opacity-10"
                  onClick={() => setSelectedFeature(index)}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {feature.description}
                  </p>
                  <div className="mt-3 text-cyan-400 text-sm font-medium">
                    Click to learn more →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {features[selectedFeature].title}
                </h3>
                <button
                  onClick={closeFeatureDetail}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-4 text-lg">
                {features[selectedFeature].description}
              </p>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold text-lg text-gray-900 mb-3">
                  Detailed Information
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {features[selectedFeature].details}
                </p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeFeatureDetail}
                  className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoFeaturesSection;
