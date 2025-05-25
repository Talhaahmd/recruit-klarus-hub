
import React from 'react';
import { motion } from "framer-motion";

interface TeamMember {
  id: number;
  name: string;
  title: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  // CEOs
  {
    id: 1,
    name: "Sanjar Mukhamedov",
    title: "CEO & Founder",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747879098/WhatsApp_Image_2025-05-20_at_09.09.03_70d3b648_qzcyew.jpg"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Co-Founder & CEO",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  // Product Manager
  {
    id: 3,
    name: "Muhammad Talha",
    title: "Product Manager",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747429819/1731658337478_rf0ng7.jpg"
  },
  // Technical Leads
  {
    id: 4,
    name: "Ibrahim Ch",
    title: "Technical Lead",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747429842/Screenshot_2025-05-17_020917_zc7inz.png"
  },
  {
    id: 5,
    name: "Alex Thompson",
    title: "Technical Lead",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 6,
    name: "Michael Chen",
    title: "Technical Lead",
    image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  // Instructional Designers
  {
    id: 7,
    name: "Noor Shahzad",
    title: "Instructional Designer",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747429967/Screenshot_2025-05-17_021238_tk7ffi.png"
  },
  {
    id: 8,
    name: "Emily Rodriguez",
    title: "Instructional Designer",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

const grad1 = {
  initial: {
    x1: "0%",
    x2: "0%",
    y1: "80%",
    y2: "100%",
  },
  animate: {
    x1: ["0%", "0%", "200%"],
    x2: ["0%", "0%", "180%"],
    y1: ["80%", "0%", "0%"],
    y2: ["100%", "20%", "20%"],
  },
};

const grad2 = {
  initial: {
    x1: "0%",
    x2: "0%",
    y1: "80%",
    y2: "100%",
  },
  animate: {
    x1: ["20%", "100%", "100%"],
    x2: ["0%", "90%", "90%"],
    y1: ["80%", "80%", "-20%"],
    y2: ["100%", "100%", "0%"],
  },
};

const grad3 = {
  initial: {
    x1: "0%",
    x2: "0%",
    y1: "80%",
    y2: "100%",
  },
  animate: {
    x1: ["20%", "100%", "100%"],
    x2: ["0%", "90%", "90%"],
    y1: ["80%", "80%", "-20%"],
    y2: ["100%", "100%", "0%"],
  },
};

const grad4 = {
  initial: {
    x1: "40%",
    x2: "50%",
    y1: "160%",
    y2: "180%",
  },
  animate: {
    x1: "0%",
    x2: "10%",
    y1: "-40%",
    y2: "-20%",
  },
};

const grad5 = {
  initial: {
    x1: "-40%",
    x2: "-10%",
    y1: "0%",
    y2: "20%",
  },
  animate: {
    x1: ["40%", "0%", "0%"],
    x2: ["10%", "0%", "0%"],
    y1: ["0%", "0%", "180%"],
    y2: ["20%", "20%", "200%"],
  },
};

const GradientColors = () => {
  return (
    <>
      <stop stopColor="#18CCFC" stopOpacity="0"></stop>
      <stop stopColor="#18CCFC"></stop>
      <stop offset="0.325" stopColor="#6344F5"></stop>
      <stop offset="1" stopColor="#AE48FF" stopOpacity="0"></stop>
    </>
  );
};

const SVGs = () => {
  return (
    <svg
      width="858"
      height="434"
      viewBox="0 0 858 434"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex flex-shrink-0"
    >
      <path
        d="M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5"
        stroke="rgb(30 41 59)"
      />
      <path
        d="M568 200H841C846.523 200 851 195.523 851 190V40"
        stroke="rgb(30 41 59)"
      />
      <path
        d="M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5"
        stroke="rgb(30 41 59)"
      />
      <path
        d="M493 274V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427"
        stroke="rgb(30 41 59)"
      />
      <path
        d="M380 168V17C380 11.4772 384.477 7 390 7H414"
        stroke="rgb(30 41 59)"
      />

      {/* Gradient Beams */}
      <path
        d="M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5"
        stroke="url(#grad1)"
      />
      <path
        d="M568 200H841C846.523 200 851 195.523 851 190V40"
        stroke="url(#grad2)"
      />
      <path
        d="M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5"
        stroke="url(#grad3)"
      />
      <path
        d="M493 274V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427"
        stroke="url(#grad4)"
      />
      <path
        d="M380 168V17C380 11.4772 384.477 7 390 7H414"
        stroke="url(#grad5)"
      />

      <defs>
        <motion.linearGradient
          variants={grad5}
          animate="animate"
          initial="initial"
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            repeatDelay: 2,
            delay: Math.random() * 2,
          }}
          id="grad5"
        >
          <GradientColors />
        </motion.linearGradient>
        <motion.linearGradient
          variants={grad1}
          animate="animate"
          initial="initial"
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            repeatDelay: 2,
            delay: Math.random() * 2,
          }}
          id="grad1"
        >
          <GradientColors />
        </motion.linearGradient>
        <motion.linearGradient
          variants={grad2}
          animate="animate"
          initial="initial"
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            repeatDelay: 2,
            delay: Math.random() * 2,
          }}
          id="grad2"
        >
          <GradientColors />
        </motion.linearGradient>
        <motion.linearGradient
          variants={grad3}
          animate="animate"
          initial="initial"
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            repeatDelay: 2,
            delay: Math.random() * 2,
          }}
          id="grad3"
        >
          <GradientColors />
        </motion.linearGradient>
        <motion.linearGradient
          variants={grad4}
          animate="animate"
          initial="initial"
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            repeatDelay: 2,
            delay: Math.random() * 2,
          }}
          id="grad4"
        >
          <GradientColors />
        </motion.linearGradient>
      </defs>

      {/* Team member circles at connection points */}
      <foreignObject x="845" y="28" width="12" height="12">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 -translate-x-6 -translate-y-6">
          <img 
            src={teamMembers[0].image} 
            alt={teamMembers[0].name}
            className="w-full h-full object-cover"
          />
        </div>
      </foreignObject>

      <foreignObject x="764" y="421" width="12" height="12">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400 -translate-x-6 -translate-y-6">
          <img 
            src={teamMembers[1].image} 
            alt={teamMembers[1].name}
            className="w-full h-full object-cover"
          />
        </div>
      </foreignObject>

      <foreignObject x="136" y="421" width="12" height="12">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-400 -translate-x-6 -translate-y-6">
          <img 
            src={teamMembers[2].image} 
            alt={teamMembers[2].name}
            className="w-full h-full object-cover"
          />
        </div>
      </foreignObject>

      <foreignObject x="0.5" y="392.5" width="12" height="12">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 -translate-x-6 -translate-y-6">
          <img 
            src={teamMembers[3].image} 
            alt={teamMembers[3].name}
            className="w-full h-full object-cover"
          />
        </div>
      </foreignObject>

      <foreignObject x="414.5" y="0.5" width="12" height="12">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-400 -translate-x-6 -translate-y-6">
          <img 
            src={teamMembers[4].image} 
            alt={teamMembers[4].name}
            className="w-full h-full object-cover"
          />
        </div>
      </foreignObject>

      {/* Additional team members positioned around */}
      <foreignObject x="420" y="210" width="12" height="12">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-400 -translate-x-6 -translate-y-6">
          <img 
            src={teamMembers[5].image} 
            alt={teamMembers[5].name}
            className="w-full h-full object-cover"
          />
        </div>
      </foreignObject>

      <foreignObject x="250" y="180" width="12" height="12">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-400 -translate-x-6 -translate-y-6">
          <img 
            src={teamMembers[6].image} 
            alt={teamMembers[6].name}
            className="w-full h-full object-cover"
          />
        </div>
      </foreignObject>

      <foreignObject x="580" y="160" width="12" height="12">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-400 -translate-x-6 -translate-y-6">
          <img 
            src={teamMembers[7].image} 
            alt={teamMembers[7].name}
            className="w-full h-full object-cover"
          />
        </div>
      </foreignObject>
    </svg>
  );
};

const TeamSection: React.FC = () => {
  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-sm font-medium tracking-widest uppercase"
          >
            Our Team
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-5xl font-bold text-white md:text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Connect with Excellence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            The passionate individuals driving innovation in recruitment
          </motion.p>
        </div>

        {/* Animated Network with Team Members */}
        <div className="flex h-[40rem] relative items-center justify-center antialiased overflow-hidden">
          <div className="bg-slate-800 w-[320px] z-40 h-[120px] group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px">
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="relative flex justify-center w-[320px] text-center space-x-2 h-[120px] items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
              <span className="md:text-4xl text-base inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-300 via-neutral-600 to-neutral-300">
                Connect
              </span>
            </div>
          </div>
          
          {/* Core SVGs component with team members */}
          <div className="absolute inset-0 flex items-center justify-center">
            <SVGs />
          </div>
        </div>

        {/* Team Member Names Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <h4 className="text-lg font-semibold text-white mb-1">
                {member.name}
              </h4>
              <p className="text-cyan-400 text-sm">
                {member.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
