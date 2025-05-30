
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      <section className="pt-8 sm:pt-12 lg:pt-20 pb-8 sm:pb-12 lg:pb-16">
        <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900">
              Your Full Stack
              <span className="relative inline-flex ml-2 sm:ml-3">
                <span
                  className="absolute inset-0 blur-sm opacity-30"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(0,183,255,0.5), rgba(0,102,255,0.2))',
                  }}
                ></span>
                <span className="relative text-blue-600 drop-shadow-[0_0_6px_rgba(0,183,255,0.6)]">
                  LinkedIn
                </span>
              </span>{' '}
              Developer
            </p>

            <div className="px-4 sm:items-center sm:justify-center sm:px-0 sm:space-x-6 sm:flex mt-8 lg:mt-10">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-blue-600 border-2 border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>

            <p className="mt-6 sm:mt-8 text-sm sm:text-base text-gray-600">14 Days free trial · No credit card required</p>
          </div>
        </div>

        {/* Video in Laptop Frame */}
        <div className="mt-12 sm:mt-16 lg:mt-20 px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-5xl">
          <div className="relative mx-auto" style={{ maxWidth: '900px' }}>
            {/* Laptop Frame */}
            <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-3xl p-3 sm:p-4 shadow-2xl">
              {/* Screen Bezel */}
              <div className="bg-black rounded-t-2xl p-2 sm:p-3">
                {/* Actual Video */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src="https://res.cloudinary.com/dt93sahp2/video/upload/q_auto:best,f_auto/Untitled_video_-_Made_with_Clipchamp_udsinf.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    controls={false}
                  />
                </div>
              </div>
              
              {/* Laptop Base */}
              <div className="h-3 sm:h-4 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-2xl"></div>
            </div>
            
            {/* Keyboard Base */}
            <div className="h-1 sm:h-2 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-3xl mx-8 sm:mx-12"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
