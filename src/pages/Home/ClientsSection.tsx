
import React, { useRef, useEffect } from 'react';

const clients = [
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png' },
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png' },
  { name: 'Facebook', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png' },
  { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png' },
];

const ClientsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!clientsRef.current) return;
      
      const scrollPosition = window.scrollY;
      const section = sectionRef.current;
      
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
          section.classList.add('opacity-100');
          section.classList.remove('opacity-0', 'translate-y-10');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-black text-white transition-all duration-1000 transform opacity-0 translate-y-10">
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

        <div ref={clientsRef} className="relative">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10"></div>
          
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee">
              {[...clients, ...clients].map((client, index) => (
                <div key={index} className="flex-shrink-0 w-48 mx-12 filter grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="h-16 w-auto object-contain mx-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border border-gray-800 hover:border-gray-700">
            <div className="text-3xl font-bold text-white mb-2">97%</div>
            <p className="text-gray-400">Client satisfaction rate</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 border border-gray-800 hover:border-gray-700">
            <div className="text-3xl font-bold text-white mb-2">250+</div>
            <p className="text-gray-400">Global companies using our platform</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border border-gray-800 hover:border-gray-700">
            <div className="text-3xl font-bold text-white mb-2">10k+</div>
            <p className="text-gray-400">Successful placements</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
