
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
      </div>
    </section>
  );
};

export default ClientsSection;
