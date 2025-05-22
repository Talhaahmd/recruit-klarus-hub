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
        <div className="text-center mb-16">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Trusted By
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Our Valued Clients</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Industry leaders trust our platform to find their next generation of talent
          </p>
        </div>

        {/* Static clients display with glow effect - first row with 3 clients */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center">
            {clients.slice(0, 3).map((client, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 transition-all duration-300 transform group-hover:scale-110">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="h-24 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second row with 4 clients */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 justify-items-center">
            {clients.slice(3, 7).map((client, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 transition-all duration-300 transform group-hover:scale-110">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="h-24 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats section - kept unchanged */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-10 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-800 hover:border-gray-700">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent mb-3">12</div>
              <p className="text-gray-300 font-medium">Companies</p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-10 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-500 border border-gray-800 hover:border-gray-700">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent mb-3">88+</div>
              <p className="text-gray-300 font-medium">Candidates hired globally</p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-10 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-500 border border-gray-800 hover:border-gray-700">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent mb-3">10k+</div>
              <p className="text-gray-300 font-medium">Candidates evaluated</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
