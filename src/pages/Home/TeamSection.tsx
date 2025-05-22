
import React, { useState } from 'react';
import { Linkedin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
            <div 
              key={member.id} 
              className="relative group"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-black p-2 border border-gray-800 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 h-[500px]">
                <div className="h-[320px] overflow-hidden rounded-t-lg">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-500 transform group-hover:scale-105"
                  />
                </div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200 flex items-center justify-center"
                    >
                      <Linkedin size={16} />
                    </a>
                  </div>
                  
                  <p className="text-cyan-400 mb-3 text-sm">{member.title}</p>
                  
                  <div className="transition-all duration-300 max-h-24 overflow-hidden">
                    <p className="text-gray-300 text-sm">{member.description}</p>
                  </div>
                  
                  {hoveredMember === member.id && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-12" />
                  )}
                </div>
              </div>
              
              {hoveredMember === member.id && (
                <div className="absolute inset-0 bg-black bg-opacity-85 p-6 flex flex-col justify-center items-center transition-opacity duration-300 rounded-xl opacity-0 group-hover:opacity-100">
                  <Avatar className="h-24 w-24 mb-4 border-2 border-cyan-500">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="bg-cyan-900 text-white text-xl">
                      {member.name.split(' ').map(name => name[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-cyan-400 mb-4 text-sm">{member.title}</p>
                  <p className="text-gray-300 text-center mb-6">{member.description}</p>
                  
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
                  >
                    <Linkedin size={18} />
                    Connect on LinkedIn
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
