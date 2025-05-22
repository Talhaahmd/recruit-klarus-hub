
import React, { useRef } from 'react';
import { LinkPreview } from '@/components/ui/link-preview';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Our client companies from USA and Middle East
const clients = [
  {
    name: 'Aramex', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Aramex_logo.svg/1200px-Aramex_logo.svg.png',
    url: 'https://www.aramex.com',
    description: 'Helped streamline their talent acquisition process, reducing hiring time by 40% and increasing quality of hires by 25%.'
  },
  {
    name: 'SABIC', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/SABIC_logo.svg/2560px-SABIC_logo.svg.png',
    url: 'https://www.sabic.com',
    description: 'Implemented an AI-driven candidate screening solution that boosted their technical hiring pipeline efficiency by 35%.'
  },
  {
    name: 'Lucid Motors', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Lucid_logo.svg/2560px-Lucid_logo.svg.png',
    url: 'https://www.lucidmotors.com',
    description: 'Developed a specialized engineering talent pool that helped them scale their R&D team by 60% in just 8 months.'
  },
  {
    name: 'Palantir', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Palantir_Technologies_logo.svg/1200px-Palantir_Technologies_logo.svg.png',
    url: 'https://www.palantir.com',
    description: 'Created a secure, compliance-focused recruitment workflow that improved their sensitive position hiring by 45%.'
  },
  {
    name: 'Mubadala', 
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/38/Mubadala_Investment_Company_logo.svg/1200px-Mubadala_Investment_Company_logo.svg.png',
    url: 'https://www.mubadala.com',
    description: 'Designed an executive search program that increased C-suite diversity by 40% while maintaining their strict qualification standards.'
  },
  {
    name: 'Riot Games', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Riot_Games_logo.svg/1200px-Riot_Games_logo.svg.png',
    url: 'https://www.riotgames.com',
    description: 'Implemented a culture-first hiring approach that reduced turnover by 30% and increased team performance metrics by 25%.'
  },
];

const ClientsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-black via-gray-900 to-black text-white transition-all duration-1000">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Success Stories
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Our Valued Clients</h2>
          
          <div className="mt-8 text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            <p className="mb-4">
              At Klarus HR, we've partnered with innovative organizations across the United States and Middle East 
              to transform their talent acquisition strategies. Our AI-driven platform has helped our clients 
              <LinkPreview url="https://blog.recruitee.com/recruitment-metrics/" className="font-semibold text-cyan-400 mx-1" width={300} height={180}>
                reduce time-to-hire by up to 40%
              </LinkPreview> 
              while simultaneously improving candidate quality and team diversity.
            </p>
            <p>
              We've enabled companies to build high-performing teams in competitive industries through our
              <LinkPreview url="https://www.linkedin.com/pulse/ai-recruitment-transforming-hiring-process-matthew-warzel-cprw/" className="font-semibold text-purple-400 mx-1" width={300} height={180}>
                advanced AI matching algorithms
              </LinkPreview>
              and deep talent pool, giving them the competitive edge in today's fast-paced market.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {clients.map((client, index) => (
            <div key={index} className="relative transform transition-all duration-500 hover:scale-105">
              {/* Glow effect background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              
              {/* Card content with glass effect */}
              <div className="relative glass-dark rounded-xl p-6 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 mr-4 flex-shrink-0 bg-white/10 rounded-lg p-2 flex items-center justify-center">
                    <img 
                      src={client.logo} 
                      alt={client.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">
                    <LinkPreview 
                      url={client.url} 
                      className="text-white hover:text-cyan-400 transition-colors"
                      width={320}
                      height={200}
                    >
                      {client.name}
                    </LinkPreview>
                  </h3>
                </div>
                
                <p className="text-gray-300 flex-grow mb-4">{client.description}</p>
                
                <a 
                  href={client.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Visit website
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
