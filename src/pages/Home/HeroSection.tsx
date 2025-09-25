import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="overflow-x-hidden bg-background min-h-screen relative pt-16">
      <section className="pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 relative z-10">
        <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground">
              Your Full Stack
              <span className="relative inline-flex ml-2 sm:ml-3">
                <span className="relative text-primary">
                  LinkedIn
                </span>
              </span>{' '}
              Developer
            </h1>

            <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionize your LinkedIn presence with AI-powered content creation, 
              smart lead tracking, and intelligent hiring tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 lg:mt-12">
              <Link
                to="/dashboard?role=personal"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary border-2 border-transparent rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Grow your LinkedIn presence
              </Link>
              <Link
                to="/dashboard?role=hr"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-foreground bg-background border-2 border-border rounded-xl hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border transition-all duration-200"
              >
                Manage hiring & recruitment
              </Link>
            </div>

            <p className="mt-6 sm:mt-8 text-sm sm:text-base text-muted-foreground">
              14 days free trial · No credit card required
            </p>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-6xl">
          <div className="relative mx-auto">
            <div className="relative bg-background rounded-2xl p-4 shadow-2xl border border-border">
              <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dt93sahp2/image/upload/v1748548888/Screenshot_2025-05-30_010106_hdqfk2.png"
                  alt="Klarus HR Dashboard Preview"
                  className="w-full h-full object-cover"
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
