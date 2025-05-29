
import React from 'react';

const VideoSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen bg-gray-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          className="w-full h-full object-cover"
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
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">From CV to Interview</h2>
          <p className="text-xl md:text-2xl">In Under 60 Seconds</p>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
