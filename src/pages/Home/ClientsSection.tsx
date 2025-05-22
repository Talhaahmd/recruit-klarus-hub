
import React, { useRef } from 'react';

// Updated clients list with 7 clients
const clients = [
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png' },
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png' },
  { name: 'Facebook', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png' },
  { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png' },
  { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png' },
];

const ClientsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="py-24 bg-black text-white transition-all duration-1000 transform">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Trusted By
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Our Valued Clients</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Industry leaders trust our platform to find their next generation of talent
          </p>
        </div>

        {/* First row with 3 clients - increased spacing */}
        <div className="mb-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 justify-items-center">
            {clients.slice(0, 3).map((client, index) => (
              <div key={index} className="relative group">
                {/* Enhanced glow effect */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-light"></div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150 animate-pulse-light"></div>
                
                {/* Increased logo size and improved hover animation */}
                <div className="relative z-10 transition-all duration-500 transform group-hover:scale-110">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="h-32 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second row with 4 clients - increased spacing */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14 justify-items-center">
            {clients.slice(3, 7).map((client, index) => (
              <div key={index} className="relative group">
                {/* Enhanced glow effect */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-light"></div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150 animate-pulse-light"></div>
                
                {/* Increased logo size and improved hover animation */}
                <div className="relative z-10 transition-all duration-500 transform group-hover:scale-110">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="h-32 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats section removed as requested */}
      </div>
    </section>
  );
};

export default ClientsSection;
