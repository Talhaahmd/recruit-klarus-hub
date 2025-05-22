
import React from 'react';

const VideoSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen">
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
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Transform Your Hiring Process
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
            Our AI-powered platform makes finding the perfect candidate easier than ever
          </p>
          <div className="flex justify-center">
            <button className="relative group">
              <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50 animate-pulse"></div>
              <a
                href="#demo"
                className="relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-black border border-transparent rounded-full"
              >
                Get Started Today
              </a>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
