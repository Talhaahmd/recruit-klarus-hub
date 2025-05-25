
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
  position: string;
}

const teamMembers: TeamMember[] = [
  // Founders & CEO
  {
    id: 1,
    name: "Sanjar Mukhamedov",
    title: "CEO & Founder",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747879098/WhatsApp_Image_2025-05-20_at_09.09.03_70d3b648_qzcyew.jpg",
    description: "Sanjar is an innovation driven entrepreneur with over 17 years of working in industry. With experience in middle east, Russia, Central Asia, and now present in Arizona, Sanjar is driven to create SaaS that deliver value to the client.",
    linkedinUrl: "https://www.linkedin.com/in/sanjar-mukhamedov-1161a0a8/",
    position: "founders"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Co-Founder & CTO",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Sarah brings 15+ years of technical leadership experience, specializing in AI and machine learning solutions. She leads our technical vision and product development.",
    linkedinUrl: "#",
    position: "founders"
  },
  // Product Managers
  {
    id: 3,
    name: "Muhammad Talha",
    title: "Product Manager & Automations Engineer",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747429819/1731658337478_rf0ng7.jpg",
    description: "Talha manages Klarus Operations & Automations. With his experience in designing CI/CD pipelines, Talha excels in managing and using LLM and NLPs while overseeing various technical and development tasks.",
    linkedinUrl: "https://www.linkedin.com/in/muhammad-talha-38364426b/",
    position: "product"
  },
  // Technical Leads
  {
    id: 4,
    name: "Ibrahim Ch",
    title: "Software Development Lead",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747429842/Screenshot_2025-05-17_020917_zc7inz.png",
    description: "As head of software development operations, Ibrahim is constantly figuring out various methods to develop and update softwares.",
    linkedinUrl: "https://www.linkedin.com/in/ibrahim-ch-008779274/",
    position: "technical"
  },
  {
    id: 5,
    name: "Alex Thompson",
    title: "Senior Technical Lead",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Alex leads our backend architecture team with 8+ years of experience in scalable systems. Specializes in microservices and cloud infrastructure.",
    linkedinUrl: "#",
    position: "technical"
  },
  {
    id: 6,
    name: "Michael Chen",
    title: "Frontend Technical Lead",
    image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Michael drives our frontend innovation with expertise in React, TypeScript, and modern web technologies. Passionate about user experience and performance.",
    linkedinUrl: "#",
    position: "technical"
  },
  // Instructional Designers
  {
    id: 7,
    name: "Noor Shahzad",
    title: "Lead Instructional Designer",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1747429967/Screenshot_2025-05-17_021238_tk7ffi.png",
    description: "With over 2+ years of experience in leading cross-functional teams, Noor specializes in managing end-to-end technical operations with execution to drive innovation and efficiency.",
    linkedinUrl: "https://www.linkedin.com/in/noorshahzad99/",
    position: "design"
  },
  {
    id: 8,
    name: "Emily Rodriguez",
    title: "Senior Instructional Designer",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Emily crafts engaging learning experiences with a focus on user-centered design. Her background in psychology and UX design creates impactful educational content.",
    linkedinUrl: "#",
    position: "design"
  },
  {
    id: 9,
    name: "David Park",
    title: "Instructional Designer",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "David brings creativity and technical expertise to our design team. He specializes in creating interactive content and multimedia learning solutions.",
    linkedinUrl: "#",
    position: "design"
  }
];

const positions = [
  { id: "founders", name: "Founders & CEO", count: 2, color: "from-purple-500 to-pink-500" },
  { id: "product", name: "Product Managers", count: 1, color: "from-blue-500 to-cyan-500" },
  { id: "technical", name: "Technical Leads", count: 3, color: "from-green-500 to-emerald-500" },
  { id: "design", name: "Instructional Designers", count: 3, color: "from-orange-500 to-red-500" }
];

const TeamSection: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<string>("founders");
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const filteredMembers = teamMembers.filter(member => member.position === selectedPosition);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase"
          >
            Our Team
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-4xl font-bold text-white md:text-5xl"
          >
            Meet the Experts
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto"
          >
            The passionate individuals behind our mission to transform recruitment
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Side - Positions */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">Departments</h3>
            {positions.map((position, index) => (
              <motion.button
                key={position.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedPosition(position.id)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 group ${
                  selectedPosition === position.id
                    ? 'bg-gradient-to-r ' + position.color + ' shadow-lg shadow-purple-500/20'
                    : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-lg font-semibold ${
                      selectedPosition === position.id ? 'text-white' : 'text-gray-300'
                    }`}>
                      {position.name}
                    </h4>
                    <p className={`text-sm ${
                      selectedPosition === position.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {position.count} {position.count === 1 ? 'member' : 'members'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    selectedPosition === position.id 
                      ? 'bg-white' 
                      : 'bg-gradient-to-r ' + position.color
                  }`} />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right Side - Team Members */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPosition}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onHoverStart={() => setHoveredMember(member.id)}
                    onHoverEnd={() => setHoveredMember(null)}
                  >
                    <div className="relative h-80 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 group-hover:border-cyan-500/50 transition-all duration-500">
                      {/* Image */}
                      <div className="h-48 overflow-hidden">
                        <motion.img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                        <p className="text-cyan-400 text-sm mb-2">{member.title}</p>
                        
                        <AnimatePresence>
                          {hoveredMember === member.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                                {member.description.substring(0, 100)}...
                              </p>
                              <motion.a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Linkedin size={14} />
                                Connect
                              </motion.a>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
