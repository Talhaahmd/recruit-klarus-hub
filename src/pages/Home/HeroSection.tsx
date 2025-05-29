
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <section className="pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="px-6 text-lg text-blue-600 font-medium mb-6"></h1>
            <p className="text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight">
              Your Full Stack
              <span className="relative inline-flex sm:inline ml-3">
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative text-blue-600"> LinkedIn </span>
              </span>
            </p>

            <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-6 sm:flex mt-10">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-blue-600 border-2 border-transparent sm:w-auto rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg hover:shadow-xl"
                role="button"
              >
                Sign Up
              </Link>
            </div>

            <p className="mt-8 text-base text-gray-500">14 Days free trial · No credit card required</p>
          </div>
        </div>

        {/* Laptop/Tablet Frame with Video */}
        <div className="mt-16 px-4 mx-auto max-w-5xl">
          <div className="relative mx-auto max-w-4xl">
            {/* Laptop Frame */}
            <div className="relative bg-gray-800 rounded-t-lg p-2 shadow-2xl">
              {/* Laptop Screen Bezel */}
              <div className="bg-black rounded-lg p-1">
                {/* Video Container */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    className="w-full h-full object-cover rounded-lg"
                    src="https://res.cloudinary.com/dt3ufcdjs/video/upload/v1747877160/Final_Comp_cnp4bl.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>
              {/* Laptop Bottom */}
              <div className="h-4 bg-gray-700 rounded-b-lg shadow-lg"></div>
            </div>
            
            {/* Laptop Base */}
            <div className="relative">
              <div className="mx-auto w-32 h-2 bg-gray-600 rounded-b-lg shadow-lg"></div>
              <div className="mx-auto w-48 h-1 bg-gray-400 rounded-lg mt-1"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
