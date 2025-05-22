
import React, { useRef } from 'react';

// Updated clients list with 7 less mainstream companies from USA and Middle East
const clients = [
  { name: 'Aramex', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Aramex_logo.svg/1200px-Aramex_logo.svg.png' },
  { name: 'SABIC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/SABIC_logo.svg/2560px-SABIC_logo.svg.png' },
  { name: 'Lucid Motors', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Lucid_logo.svg/2560px-Lucid_logo.svg.png' },
  { name: 'Palantir', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Palantir_Technologies_logo.svg/1200px-Palantir_Technologies_logo.svg.png' },
  { name: 'Mubadala', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/38/Mubadala_Investment_Company_logo.svg/1200px-Mubadala_Investment_Company_logo.svg.png' },
  { name: 'Riot Games', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Riot_Games_logo.svg/1200px-Riot_Games_logo.svg.png' },
  { name: 'Okta', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Okta_Logo.svg/2560px-Okta_Logo.svg.png' },
];

const ClientsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-black to-gray-900 text-white transition-all duration-1000 transform">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Trusted By
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Our Valued Clients</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Industry leaders across the globe trust our platform to find their next generation of talent
          </p>
        </div>

        <div className="relative overflow-hidden py-10">
          {/* Subtle glow background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-3xl"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-16 justify-items-center items-center">
            {clients.map((client, index) => (
              <div 
                key={index} 
                className={`relative group ${index >= 4 ? 'col-span-1 md:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* Enhanced glow effect */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-light"></div>
                
                {/* Logo container with glass effect on hover */}
                <div className="relative z-10 h-24 w-full flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 rounded-xl group-hover:glass-dark p-4">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                
                {/* Company name appearing on hover */}
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium text-gray-400">{client.name}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-0 w-40 h-40 bg-cyan-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-10 w-60 h-60 bg-purple-500/5 rounded-full filter blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
