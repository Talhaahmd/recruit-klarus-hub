
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const FeaturesSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const translateY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), {
    stiffness: 60,
    damping: 20
  });

  return (
    <section className="bg-gray-900 text-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
      <motion.div
        style={{ y: translateY }}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16"
      >
        {/* Title on left */}
        <div className="lg:col-span-1 flex items-start">
          <h2 className="text-lg sm:text-xl font-semibold text-white mt-1">About Us</h2>
        </div>

        {/* Description + Stats */}
        <div className="lg:col-span-2 space-y-8 sm:space-y-12">
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-300">
            We are <strong className="text-white">Klarus</strong> — the first-of-its-kind, multi-modal platform engineered to transform how professionals manage their presence on{' '}
            <strong className="text-[#0077B5] font-semibold">LinkedIn</strong>. Klarus empowers you with strategic content planning, real-time lead and application tracking, intelligent hiring assessment tools, and access to high-impact trending topics — so you not only build your profile, but truly differentiate yourself in the market.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white">88+</h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-400">Paid Clients</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white">3+</h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-400">AI Models Enabled</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white">100%+</h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-400">Client Satisfactions</p>
            </div>
          </div>

          {/* Arrow CTA */}
          <div className="flex flex-col items-center mt-8 sm:mt-12">
            <p className="text-xs sm:text-sm font-medium text-gray-200 mb-2">Discover our features</p>
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bounce" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
