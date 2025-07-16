
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const FeaturesSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const translateY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), {
    stiffness: 60,
    damping: 20
  });

  return (
    <section id="features" className="bg-background py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
      <motion.div
        style={{ y: translateY }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Choose Klarus HR?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            We are <strong className="text-foreground">Klarus</strong> — the first-of-its-kind, multi-modal platform engineered to transform how professionals manage their presence on{' '}
            <strong className="text-primary font-semibold">LinkedIn</strong>. Klarus empowers you with strategic content planning, real-time lead and application tracking, intelligent hiring assessment tools, and access to high-impact trending topics.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-2">88+</h3>
            <p className="text-muted-foreground font-medium">Happy Clients</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-2">3+</h3>
            <p className="text-muted-foreground font-medium">AI Models</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-2">100%</h3>
            <p className="text-muted-foreground font-medium">Satisfaction Rate</p>
          </div>
        </div>

        {/* Arrow CTA */}
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">Discover our features</p>
          <ChevronDown className="w-6 h-6 text-primary animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
