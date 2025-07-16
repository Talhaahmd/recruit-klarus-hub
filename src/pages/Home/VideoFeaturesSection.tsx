
import React from 'react';
import { ChevronDown } from 'lucide-react';

const features = [
  {
    title: "Google Recognized Optimized LinkedIn Topics For You To Choose From",
    description: "Leverage AI to select high-performing, SEO-optimized topics aligned with Google and LinkedIn algorithms to maximize reach and credibility.",
    videoSrc: "https://res.cloudinary.com/dt93sahp2/video/upload/q_auto:best,f_auto/Untitled_video_-_Made_with_Clipchamp_udsinf.mp4"
  },
  {
    title: "Let AI Track Your Job Applications & Talent Pool so you can hire the best talent",
    description: "Track every application in real-time, manage candidate pipelines, and tap into a centralized talent pool — all powered by AI.",
    videoSrc: "https://res.cloudinary.com/dt93sahp2/video/upload/q_auto:best,f_auto/Untitled_video_-_Made_with_Clipchamp_1_erktxb.mp4"
  },
  {
    title: "Follow up with leads, send customized emails with only a click",
    description: "Automate outreach using smart templates — follow up, engage leads, and convert interest into action with a single click.",
    videoSrc: "https://res.cloudinary.com/dt93sahp2/video/upload/q_auto:best,f_auto/Untitled_video_-_Made_with_Clipchamp_2_r0lksl.mp4"
  }
];

const FeatureVideoSection: React.FC = () => {
  return (
    <section className="bg-muted/30 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful Features for Modern Professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our AI-powered platform transforms your LinkedIn strategy and hiring process
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <button className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors">
                  Learn more
                  <ChevronDown className="ml-2 w-4 h-4 rotate-[-90deg]" />
                </button>
              </div>

              {/* Video */}
              <div className="flex-1 w-full max-w-2xl">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border border-border">
                  <div className="aspect-video">
                    <video
                      src={feature.videoSrc}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      controls={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureVideoSection;
