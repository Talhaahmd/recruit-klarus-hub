
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
            <h1 className="px-6 text-lg text-blue-600 font-medium mb-4">Smart HR platform, made for modern recruitment</h1>
            <p className="text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight">
              Turn your candidates into perfect
              <span className="relative inline-flex sm:inline ml-3">
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative text-blue-600"> matches </span>
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

              <button
                onClick={scrollToDemo}
                className="inline-flex items-center justify-center w-full px-6 py-4 mt-4 text-lg font-semibold text-blue-600 transition-all duration-200 border-2 border-blue-200 sm:w-auto sm:mt-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-50 hover:border-blue-300"
                role="button"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch free demo
              </button>
            </div>

            <p className="mt-8 text-base text-gray-500">60 Days free trial · No credit card required</p>
          </div>
        </div>

        <div className="pb-12 bg-white mt-16">
          <div className="relative">
            <div className="absolute inset-0 h-2/3 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
            <div className="relative mx-auto">
              <div className="lg:max-w-6xl lg:mx-auto">
                <img className="transform scale-110" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/2/illustration.png" alt="Klarus HR Dashboard" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
