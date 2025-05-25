
import React from 'react';
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const Radar = ({ className }: { className?: string }) => {
  const circles = new Array(8).fill(1);
  
  // IT job titles with their positions on the radar
  const jobDots = [
    { title: "React Developer", position: "top-1/4 left-1/3", color: "bg-green-400", shadow: "shadow-green-400/50" },
    { title: "DevOps Engineer", position: "top-1/3 right-1/4", color: "bg-blue-400", shadow: "shadow-blue-400/50" },
    { title: "Data Scientist", position: "bottom-1/3 left-1/4", color: "bg-purple-400", shadow: "shadow-purple-400/50" },
    { title: "Product Manager", position: "bottom-1/4 right-1/3", color: "bg-yellow-400", shadow: "shadow-yellow-400/50" },
    { title: "UX Designer", position: "top-2/3 left-2/3", color: "bg-red-400", shadow: "shadow-red-400/50" },
    { title: "Backend Engineer", position: "top-1/2 right-1/5", color: "bg-indigo-400", shadow: "shadow-indigo-400/50" },
    { title: "ML Engineer", position: "bottom-2/5 left-1/2", color: "bg-pink-400", shadow: "shadow-pink-400/50" },
    { title: "Tech Lead", position: "top-1/5 left-1/2", color: "bg-orange-400", shadow: "shadow-orange-400/50" }
  ];

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
      
      {/* Job title dots */}
      {jobDots.map((job, idx) => (
        <div key={job.title} className={`absolute ${job.position} group cursor-pointer`}>
          <div className={`w-3 h-3 ${job.color} rounded-full animate-pulse shadow-lg ${job.shadow}`} />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {job.title}
            </div>
          </div>
        </div>
      ))}
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
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
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
                <div className="text-3xl font-bold text-cyan-400 mb-2">6000+</div>
                <div className="text-gray-400">Jobs Supported</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-gray-400">Match Accuracy</div>
              </div>
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
