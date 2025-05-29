
import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ClientsSection from './ClientsSection';
import QuoteSection from './QuoteSection';
import Footer from './Footer';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ClientsSection />
      <QuoteSection />
      <Footer />
    </div>
  );
};

export default Home;
