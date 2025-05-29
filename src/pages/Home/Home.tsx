
import React from 'react';
import HeroSection from './HeroSection';
import VideoSection from './VideoSection';
import FeaturesSection from './FeaturesSection';
import ClientsSection from './ClientsSection';
import DemoSection from './DemoSection';
import PlansSection from './PlansSection';
import QuoteSection from './QuoteSection';
import Footer from './Footer';
import Navbar from './Navbar';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
      <ClientsSection />
      <DemoSection />
      <PlansSection />
      <QuoteSection />
      <Footer />
    </div>
  );
};

export default Home;
