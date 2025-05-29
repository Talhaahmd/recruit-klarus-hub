import React from 'react';
import { X, Minus } from 'lucide-react';

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
    <section className="bg-black">
      <div className="space-y-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className="min-h-screen w-full bg-black flex flex-col justify-between px-0 sm:px-8 py-6"
          >
            {/* Top Bar with Icons */}
            <div className="flex justify-end gap-4 px-6">
             
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center text-center gap-12 flex-grow justify-center px-6">
              <div className="max-w-[1200px]">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {feature.title}
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                  {feature.description}
                </p>
              </div>

              <div className="w-full max-w-[1600px] px-2">
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-yellow-200 via-pink-300 to-purple-400 p-1">
                  <div className="bg-black rounded-xl w-full h-[720px]">
                    <video
                      src={feature.videoSrc}
                      className="w-full h-full object-cover rounded-xl"
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

            {/* Bottom Spacer */}
            <div className="h-6" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureVideoSection;
