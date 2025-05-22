
import React, { useState } from 'react';
import { Linkedin } from 'lucide-react';

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
    name: "Alex Johnson",
    title: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZXhlY3V0aXZlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    description: "Alex has 15+ years of experience in HR technology and founded Klarus HR to revolutionize the recruiting process using AI and machine learning.",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: 2,
    name: "Sarah Williams",
    title: "CTO",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YnVzaW5lc3N3b21hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    description: "Sarah leads our engineering team with expertise in AI/ML and previously worked at Google developing cutting-edge recruitment technologies.",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: 3,
    name: "David Chen",
    title: "Head of Product",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJ1c2luZXNzJTIwcGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    description: "David oversees product strategy and development, ensuring our platform remains intuitive and effective for all users.",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    title: "VP of Client Success",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YnVzaW5lc3MlMjB3b21hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    description: "Maria ensures our clients achieve their hiring goals through strategic guidance and personalized support.",
    linkedinUrl: "https://linkedin.com",
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

        <div className="flex flex-wrap justify-center -mx-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="w-full md:w-1/4 px-4 mb-8">
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="overflow-hidden rounded-xl">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-80 object-cover object-center transition-transform duration-500 transform group-hover:scale-110"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-gray-300">{member.title}</p>
                </div>
                
                {hoveredMember === member.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-85 p-6 flex flex-col justify-center items-center transition-opacity duration-300 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-cyan-400 mb-4">{member.title}</p>
                    <p className="text-gray-300 text-center mb-6">{member.description}</p>
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
                    >
                      <Linkedin size={18} />
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
