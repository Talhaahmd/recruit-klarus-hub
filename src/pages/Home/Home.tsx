
import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ClientsSection from './ClientsSection';
import QuoteSection from './QuoteSection';
import Footer from './Footer';
import FeatureVideoSection from './VideoFeaturesSection';
import Navbar from './Navbar';
import FAQSection from './FAQSection';

const Home: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar/>
      <div id="home"><HeroSection /></div>
      <div id="solutions"><FeaturesSection /></div>
      <div id="platforms"><FeatureVideoSection/></div>
      <div id="metrics"><ClientsSection /></div>
      <div id="success"><QuoteSection /></div>
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Home;
