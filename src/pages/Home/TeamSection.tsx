
import React, { useState } from 'react';
import { Linkedin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  id: number;
  name: string;
  title: string;
  image: string;
  description: string;
  linkedinUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sanjar Mukhamedov",
    title: "CEO & Founder - Klarus AI",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747879098/WhatsApp_Image_2025-05-20_at_09.09.03_70d3b648_qzcyew.jpg",
    description: "Sanjar is an innovation driven entreprenuer with over 17 years of working in industry. With experience in middle east, Russia, Central Asia, and now present in Arizona, Sanjar is driven to create SaaS that deliver value to the client.",
    linkedinUrl: "https://www.linkedin.com/in/sanjar-mukhamedov-1161a0a8/",
  },
  {
    id: 2,
    name: "Muhammad Talha",
    title: "Product Manager & Automations Engineer",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747429819/1731658337478_rf0ng7.jpg",
    description: "Talha manages Klarus Operations & Automations. With his experience in designing CI/CD pipelines, Talha excels in managing and using LLM and NLPs while overseeing various technical and development tasks.",
    linkedinUrl: "https://www.linkedin.com/in/muhammad-talha-38364426b/",
  },
  {
    id: 3,
    name: "Ibrahim Ch",
    title: "Software Development Associate",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747429842/Screenshot_2025-05-17_020917_zc7inz.png",
    description: "As head of software development opertions, Ibrahim is constantly figuring out various methods to develop and update softwares.",
    linkedinUrl: "https://www.linkedin.com/in/ibrahim-ch-008779274/",
  },
  {
    id: 4,
    name: "Noor Shahzad",
    title: "Technical Manager",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747429967/Screenshot_2025-05-17_021238_tk7ffi.png",
    description: "With over 2+ years of experience in leading cross-functional teams, Noor specialize in managing end-to-end technical operations with execution to drive innovation and efficiency.",
    linkedinUrl: "https://www.linkedin.com/in/noorshahzad99/",
  },
];

const TeamSection: React.FC = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Our Team
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Meet the Experts</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            The passionate individuals behind our mission to transform recruitment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <motion.div 
              key={member.id} 
              className="relative group cursor-pointer h-[500px] rounded-xl overflow-hidden"
              onHoverStart={() => setHoveredMember(member.id)}
              onHoverEnd={() => setHoveredMember(null)}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-cyan-500 to-purple-500 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Image container */}
              <div className="relative h-full w-full rounded-xl overflow-hidden bg-gradient-to-r from-gray-900 to-black z-10">
                <motion.div 
                  className="h-full w-full overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </motion.div>
                
                {/* Overlay that appears on hover */}
                <AnimatePresence>
                  {hoveredMember === member.id && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 flex flex-col justify-end"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <Avatar className="h-20 w-20 mb-4 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback className="bg-cyan-900 text-white text-xl">
                            {member.name.split(' ').map(name => name[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <motion.h3 
                          className="text-2xl font-bold text-white mb-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          {member.name}
                        </motion.h3>
                        
                        <motion.p 
                          className="text-cyan-400 mb-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          {member.title}
                        </motion.p>
                        
                        <motion.p 
                          className="text-gray-300 mb-6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          {member.description}
                        </motion.p>
                        
                        <motion.a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 hover:scale-105"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Linkedin size={18} />
                          Connect on LinkedIn
                        </motion.a>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show just the name when not hovering */}
                <AnimatePresence>
                  {hoveredMember !== member.id && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
