import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const successResults = [
  {
    metric: "x2",
    description: "hiring speed boost and +213 qualified candidates in 25 days",
    company: "TechCorp Solutions",
    details: "More details"
  },
  {
    metric: "+150",
    description: "hires from scratch in 1.5 months using AI-powered sourcing",
    company: "StartupFlow Inc", 
    details: "More details"
  },
  {
    metric: "x5",
    description: "job post reach and 500+ interview bookings through gamification",
    company: "InnovateHR Ltd",
    details: "More details"
  }
];

const QuoteSection: React.FC = () => {
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
            Customer success results
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real results from companies that transformed their hiring with Klarus HR
          </p>
        </motion.div>

        {/* Success Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {successResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-xl"
            >
              {/* Metric */}
              <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl font-bold text-primary mb-2">
                  {result.metric}
                </div>
                <p className="text-lg text-foreground font-medium leading-relaxed">
                  {result.description}
                </p>
              </div>

              {/* Company */}
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground font-medium">
                  {result.company}
                </p>
              </div>

              {/* CTA */}
              <div className="text-center">
                <button className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group-hover:translate-x-1 transform duration-300">
                  {result.details}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-2xl bg-card border border-border"
          >
            <div className="mb-6">
              <svg
                className="h-8 w-8 text-primary mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-lg text-foreground font-medium mb-6 leading-relaxed">
              "Klarus HR transformed our hiring process completely. We went from posting jobs and hoping for the best to having a systematic approach that actually works. The AI chatbot handles initial screening while we focus on the best candidates."
            </p>
            <div>
              <p className="text-foreground font-semibold">Sarah Johnson</p>
              <p className="text-sm text-muted-foreground">Head of Talent Acquisition, TechFlow</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-2xl bg-card border border-border"
          >
            <div className="mb-6">
              <svg
                className="h-8 w-8 text-primary mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-lg text-foreground font-medium mb-6 leading-relaxed">
              "The gamification features are incredible. Candidates actually enjoy the application process now, and we're seeing 3x more completed applications. Plus, the quality of candidates has improved significantly."
            </p>
            <div>
              <p className="text-foreground font-semibold">Michael Chen</p>
              <p className="text-sm text-muted-foreground">Recruiting Manager, InnovateCorp</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;