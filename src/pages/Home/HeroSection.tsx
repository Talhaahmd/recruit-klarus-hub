
import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="px-6 text-lg text-blue-600 font-medium mb-4"></h1>
            <p className="text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight">
              Your Full Stack
              <span className="relative inline-flex sm:inline ml-3">
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative text-blue-600"> Linkedin </span>
              </span>
            </p>

            <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-6 sm:flex mt-10">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-blue-600 border-2 border-transparent sm:w-auto rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg hover:shadow-xl"
                role="button"
              >
                Start 14 Days Free Trial
              </Link>

              
            </div>

            <p className="mt-8 text-base text-gray-500">14 Days free trial · No credit card required</p>
          </div>
        </div>

        <div className="pb-12 bg-white mt-16">
          <div className="relative">
            <div className="absolute inset-0 h-2/3 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
            <div className="relative mx-auto">
              <div className="lg:max-w-6xl lg:mx-auto">
  <video
    className="transform scale-110"
    src="https://res.cloudinary.com/dt3ufcdjs/video/upload/v1747877160/Final_Comp_cnp4bl.mp4"
    autoPlay
    loop
    muted
    playsInline
  />
</div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
