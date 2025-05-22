
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
    </section>
  );
};

export default VideoSection;
