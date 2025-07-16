
import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ClientsSection from './ClientsSection';
import QuoteSection from './QuoteSection';
import Footer from './Footer';
import FeatureVideoSection from './VideoFeaturesSection';
import Navbar from './Navbar';

const Home: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar/>
      <HeroSection />
      <FeaturesSection />
      <FeatureVideoSection/>
      <ClientsSection />
      <QuoteSection />
      <Footer />
    </div>
  );
};

export default Home;
