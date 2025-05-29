import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div
      className="overflow-x-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dt93sahp2/image/upload/v1748548189/blue-light-rays-on-dark-blue-background-abstract-g-2024-12-05-11-07-31-utc_ourexg.jpg')`,
      }}
    >
      <section className="pt-20 sm:pt-60 bg-black bg-opacity-90 backdrop-blur pb-0">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl relative">
              Your Full Stack
              <span className="relative inline-flex ml-3">
                {/* Subtle background gradient glow */}
                <span
                  className="absolute inset-0 blur-sm opacity-30"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(0,183,255,0.5), rgba(0,102,255,0.2))',
                  }}
                ></span>
                <span className="relative text-blue-500 drop-shadow-[0_0_6px_rgba(0,183,255,0.6)]">
                  LinkedIn
                </span>
              </span>{' '}
              Developer
            </p>

            <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-6 sm:flex mt-10">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white bg-blue-600 border-2 border-transparent sm:w-auto rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Link>
            </div>

            <p className="mt-8 text-base text-gray-300">14 Days free trial · No credit card required</p>
          </div>
        </div>

        {/* Glowing Image with darker tone emphasis */}
        <div className="mt-16 px-4 mx-auto w-full max-w-[1600px] pb-0 relative">
          <div
            className="absolute inset-0 z-0 rounded-2xl blur-[120px] opacity-70"
            style={{
              background:
                'radial-gradient(circle, rgba(0,153,255,0.6), rgba(0,60,120,0.4), rgba(0,20,40,0.2))',
            }}
          ></div>
          <img
            src="https://res.cloudinary.com/dt93sahp2/image/upload/v1748548888/Screenshot_2025-05-30_010106_hdqfk2.png"
            alt="Feature preview"
            className="relative z-10 w-full h-[720px] object-cover rounded-2xl shadow-[0_0_80px_10px_rgba(0,153,255,0.6)]"
          />
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
