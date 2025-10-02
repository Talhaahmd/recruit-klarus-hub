import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const ClientsSection: React.FC = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      // Animate counter 1 to 20,000+
      const timer1 = setInterval(() => {
        setCount1(prev => {
          if (prev >= 20000) {
            clearInterval(timer1);
            return 20000;
          }
          return prev + 500;
        });
      }, 50);

      // Animate counter 2 to 500+
      const timer2 = setInterval(() => {
        setCount2(prev => {
          if (prev >= 500) {
            clearInterval(timer2);
            return 500;
          }
          return prev + 15;
        });
      }, 50);

      // Animate counter 3 to 95%
      const timer3 = setInterval(() => {
        setCount3(prev => {
          if (prev >= 95) {
            clearInterval(timer3);
            return 95;
          }
          return prev + 3;
        });
      }, 50);

      return () => {
        clearInterval(timer1);
        clearInterval(timer2);
        clearInterval(timer3);
      };
    }
  }, [isInView]);

  const companies = [
    {
      name: "SPS Commerce",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192783/sps_commerce_corp_2015_logo-removebg-preview_bz5mrn.png"
    },
    {
      name: "Sigma",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192783/sigmalogo-removebg-preview_mbt651.png"
    },
    {
      name: "OneScreen",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192782/onescreen-logo__1_-removebg-preview_boih9e.png"
    },
    {
      name: "Company 1",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192781/images-removebg-preview__2__kfratu.png"
    },
    {
      name: "Company 2",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192781/images-removebg-preview__1__zijyzh.png"
    },
    {
      name: "Drilldown",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192780/drilldown_ewf032.png"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Counter Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold text-primary mb-4"
            >
              {count1.toLocaleString()}+
            </motion.div>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
              successful hires facilitated by Klarus HR users
            </p>
          </div>
        </motion.div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center p-8 rounded-2xl bg-card border border-border"
          >
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
              {count2}+
            </div>
            <p className="text-muted-foreground font-medium">Companies Trust Us</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center p-8 rounded-2xl bg-card border border-border"
          >
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
              {count3}%
            </div>
            <p className="text-muted-foreground font-medium">Satisfaction Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center p-8 rounded-2xl bg-card border border-border"
          >
            <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
              2x
            </div>
            <p className="text-muted-foreground font-medium">Faster Hiring</p>
          </motion.div>
        </div>

        {/* Klarus Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Klarus Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each feature is designed with top HR professionals to boost your hiring and recruitment on social media
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              title: "Quick launch from smartphone",
              description: "Create a hiring campaign in 2 minutes right from your smartphone using the quick launch form. No complex setup – just enter job details and automation is ready!"
            },
            {
              title: "AI agent takes over conversations", 
              description: "Responds to candidates for you, collects applications and helps with screening. Saves time, increases conversions and builds relationships."
            },
            {
              title: "Gamification",
              description: "A ready-to-use solution for growing applications and engagement: quick setup with an auto-updating live leaderboard"
            },
            {
              title: "Task-Specific Templates",
              description: "Each template is designed with top recruiters to boost your hiring and employer brand on social media"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Trusted by innovative companies
          </h3>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.6, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-8 sm:h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection;