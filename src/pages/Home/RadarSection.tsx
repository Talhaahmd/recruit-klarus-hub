
import React from 'react';
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const Radar = ({ className }: { className?: string }) => {
  const circles = new Array(8).fill(1);
  return (
    <div
      className={twMerge(
        "relative flex h-96 w-96 items-center justify-center rounded-full",
        className
      )}
    >
      <div
        style={{
          transformOrigin: "right center",
        }}
        className="absolute right-1/2 top-1/2 z-40 flex h-[5px] overflow-hidden animate-spin w-[400px] items-end justify-center bg-transparent"
      >
        {/* Radar line that rotates */}
        <div className="relative z-40 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>
      {/* concentric circles */}
      {circles.map((circle, idx) => (
        <Circle
          style={{
            height: `${(idx + 1) * 3}rem`,
            width: `${(idx + 1) * 3}rem`,
            border: `1px solid rgba(56, 189, 248, ${0.8 - (idx + 1) * 0.1})`,
          }}
          key={`motion-${idx}`}
          idx={idx}
        />
      ))}
      
      {/* Radar dots representing candidates */}
      <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" />
      <div className="absolute bottom-1/3 left-1/4 w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50" />
      <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50" />
      <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50" />
    </div>
  );
};

const Circle = ({ className, idx, ...rest }: { className?: string; idx: number; style?: any }) => {
  return (
    <motion.div
      {...rest}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: idx * 0.1,
        duration: 0.2,
      }}
      className={twMerge(
        "absolute inset-0 left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-cyan-200/30",
        className
      )}
    />
  );
};

const RadarSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-sm font-medium tracking-widest uppercase"
              >
                Radar Preview
              </motion.span>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Your Next Big Hire Is Already{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  In Your Radar
                </span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-xl text-gray-400 leading-relaxed"
              >
                Our advanced AI scans thousands of profiles in real-time, identifying the perfect candidates before they even know they're looking. Every blip on our radar represents exceptional talent waiting to transform your business.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                <div className="text-3xl font-bold text-cyan-400 mb-2">10K+</div>
                <div className="text-gray-400">Profiles Scanned Daily</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-gray-400">Match Accuracy</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-cyan-500/25">
                Start Scanning
              </button>
              <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-gray-600 rounded-lg hover:border-gray-400 transition-all duration-200">
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Radar Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <Radar className="scale-75 md:scale-100" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RadarSection;
