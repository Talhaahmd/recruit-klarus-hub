
import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import VideoSection from './VideoSection';
import ClientsSection from './ClientsSection';
import ReviewsSection from './ReviewsSection';
import TeamSection from './TeamSection';
import DemoSection from './DemoSection';
import PlansSection from './PlansSection';
import QuoteSection from './QuoteSection';
import Footer from './Footer';
import Navbar from './Navbar';

const Home: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <VideoSection />
      <ClientsSection />
      <ReviewsSection />
      <TeamSection />
      <DemoSection />
      <PlansSection />
      <QuoteSection />
      <Footer />
    </div>
  );
};

export default Home;
