
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
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

        {/* Dual Audience Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Individuals */}
          <div className="p-6 rounded-2xl bg-card border border-border h-full">
            <h3 className="text-2xl font-bold text-foreground mb-2">Grow your LinkedIn presence</h3>
            <p className="text-muted-foreground mb-6">For individuals and creators who want consistency, reach, and credibility.</p>
            <ul className="space-y-3 text-foreground/90">
              <li className="flex gap-2"><span className="text-primary">•</span> AI-curated, Google-aware topics tailored to your niche</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Draft, refine, and schedule posts with one-click</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Track engagement trends and iterate faster</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Build a portfolio of ideas and finished posts</li>
            </ul>
            <div className="mt-6">
              <Link
                to="/dashboard?role=personal"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Start growing on LinkedIn
              </Link>
            </div>
          </div>

          {/* HR/Companies */}
          <div className="p-6 rounded-2xl bg-card border border-border h-full">
            <h3 className="text-2xl font-bold text-foreground mb-2">Manage hiring & recruitment</h3>
            <p className="text-muted-foreground mb-6">For HR teams and companies that need structure and scale.</p>
            <ul className="space-y-3 text-foreground/90">
              <li className="flex gap-2"><span className="text-primary">•</span> Centralize job postings and candidate pipelines</li>
              <li className="flex gap-2"><span className="text-primary">•</span> AI-assisted screening, shortlisting, and notes</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Automated outreach and follow-ups via templates</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Schedule interviews and sync with your calendar</li>
            </ul>
            <div className="mt-6">
              <Link
                to="/dashboard?role=hr"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-border bg-background text-foreground font-semibold hover:bg-muted transition-colors"
              >
                Streamline your hiring
              </Link>
            </div>
          </div>
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
