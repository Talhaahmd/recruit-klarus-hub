
import React, { useRef } from 'react';
import { LinkPreview } from '@/components/ui/link-preview';

// Our new client companies
const clients = [
  {
    name: 'Five Pack Creative',
    url: 'https://fivepackcreative.com/',
  },
  {
    name: 'The Keenfolks',
    url: 'https://www.thekeenfolks.com/',
  },
  {
    name: 'Klarus.io',
    url: 'https://www.klarus.io/',
  },
  {
    name: 'Kualitatem',
    url: 'https://www.kualitatem.com/',
  },
  {
    name: 'Neptune Software',
    url: 'https://www.neptune-software.com/',
  },
  {
    name: 'Chrono Innovation',
    url: 'https://www.chronoinnovation.com/',
  }
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
        </div>

        {/* Client paragraph with link previews */}
        <div className="max-w-5xl mx-auto mb-16 text-lg text-gray-200 leading-relaxed">
          <p className="mb-6">
            We've proudly supported companies like <LinkPreview url="https://fivepackcreative.com/" className="font-semibold text-cyan-400" width={320} height={200}>Five Pack Creative</LinkPreview> in scaling their teams by using Klarus HR to streamline technical hiring—while also enhancing their careers and hiring pages with the Acetrinity Link Reveal effect for a modern, interactive feel. With <LinkPreview url="https://www.thekeenfolks.com/" className="font-semibold text-purple-400" width={320} height={200}>The Keenfolks</LinkPreview>, we accelerated candidate screening for key digital roles, while ensuring their site interactions reflected their innovative spirit.
          </p>
          <p className="mb-6">
            For <LinkPreview url="https://www.klarus.io/" className="font-semibold text-cyan-400" width={320} height={200}>Klarus.io</LinkPreview>, our own product, we applied our hiring engine internally—refining how candidates experience the brand through subtle yet impactful link previews. At <LinkPreview url="https://www.kualitatem.com/" className="font-semibold text-purple-400" width={320} height={200}>Kualitatem</LinkPreview>, we helped recruit skilled cybersecurity professionals and used link animations to signal trust and attention to detail.
          </p>
          <p className="mb-6">
            We partnered with <LinkPreview url="https://www.neptune-software.com/" className="font-semibold text-cyan-400" width={320} height={200}>Neptune Software</LinkPreview> to fulfill enterprise software hiring needs, using Klarus HR's AI interviews to streamline evaluations. For <LinkPreview url="https://www.chronoinnovation.com/" className="font-semibold text-purple-400" width={320} height={200}>Chrono Innovation</LinkPreview>, we sourced top tech talent while elevating their user journey through link effects that reflect their forward-thinking identity. Each project blended hiring excellence with interactive design to deliver results that resonate.
          </p>
        </div>

        {/* Client links gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {clients.map((client, index) => (
            <div key={index} className="relative transform transition-all duration-500 hover:scale-105">
              {/* Glow effect background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              
              {/* Glass effect card */}
              <div className="relative backdrop-blur-sm bg-black/40 border border-gray-800 rounded-xl p-8 h-full flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  <LinkPreview 
                    url={client.url} 
                    className="text-white hover:text-cyan-400 transition-colors"
                    width={320}
                    height={200}
                  >
                    {client.name}
                  </LinkPreview>
                </h3>
                
                <a 
                  href={client.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mt-4"
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
