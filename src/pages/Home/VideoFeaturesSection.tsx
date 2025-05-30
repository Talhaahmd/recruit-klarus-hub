
import React from 'react';

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
    <section className="bg-gray-900">
      <div className="space-y-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className="min-h-screen w-full bg-gray-900 flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
          >
            {/* Main Content */}
            <div className="flex flex-col items-center text-center gap-8 sm:gap-12 flex-grow justify-center">
              <div className="max-w-6xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 px-4">
                  {feature.title}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-4">
                  {feature.description}
                </p>
              </div>

              <div className="w-full max-w-6xl px-2 sm:px-4">
                <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-yellow-200 via-pink-300 to-purple-400 p-1">
                  <div className="bg-gray-900 rounded-lg sm:rounded-xl w-full aspect-video">
                    <video
                      src={feature.videoSrc}
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
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
            <div className="h-4 sm:h-6" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureVideoSection;
