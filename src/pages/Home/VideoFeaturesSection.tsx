import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Briefcase, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const platforms = [
  {
    icon: Users,
    title: "LinkedIn Recruiting",
    description: "Klarus offers tools to enhance your recruiting strategy for both sourcing and employer branding, along with fresh content inspirations",
    gradient: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-600"
  },
  {
    icon: Briefcase,
    title: "ATS Integration", 
    description: "Drive organic applications, manage your talent pipeline without ads, and tackle other tasks to bring new candidates and hires to your company",
    gradient: "from-green-500/20 to-green-600/20",
    borderColor: "border-green-500/30", 
    iconBg: "bg-green-500/20",
    iconColor: "text-green-600"
  },
  {
    icon: Calendar,
    title: "Interview Automation",
    description: "Harness powerful automation tools to boost candidate engagement, streamline interviews, and drive hiring success through intelligent scheduling",
    gradient: "from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-500/30",
    iconBg: "bg-purple-500/20", 
    iconColor: "text-purple-600"
  }
];

const VideoFeaturesSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Unlock the full potential of your hiring
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive solutions for modern recruitment challenges
          </p>
        </motion.div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`group p-8 rounded-2xl bg-gradient-to-br ${platform.gradient} border ${platform.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className={`w-16 h-16 rounded-2xl ${platform.iconBg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 ${platform.iconColor}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {platform.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {platform.description}
                </p>
                
                <button className="inline-flex items-center text-foreground font-semibold hover:text-primary transition-colors group-hover:translate-x-1 transform duration-300">
                  Learn more
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Platform Sections */}
        <div className="space-y-20">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className={`w-16 h-16 rounded-2xl ${platform.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${platform.iconColor}`} />
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    {platform.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {platform.description}
                  </p>
                  
                  <Link
                    to="/signup"
                    className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors text-lg"
                  >
                    Learn more
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>

                {/* Visual/Mockup */}
                <div className="flex-1 w-full max-w-2xl">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border border-border"
                  >
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <div className={`w-24 h-24 rounded-2xl ${platform.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-12 h-12 ${platform.iconColor}`} />
                      </div>
                    </div>
                    
                    {/* Overlay with stats */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <div className="text-2xl font-bold">
                          {index === 0 ? '500+' : index === 1 ? '10k+' : '2x'}
                        </div>
                        <div className="text-sm opacity-90">
                          {index === 0 ? 'LinkedIn posts generated' : index === 1 ? 'Applications processed' : 'Faster hiring'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VideoFeaturesSection;