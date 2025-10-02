import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Users, Zap, Mail, Database, Link as LinkIcon } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: "AI-Powered Chatbots",
    description: "Keep in touch with candidates 24/7 and never miss a promising lead with intelligent conversation flows"
  },
  {
    icon: Users,
    title: "Referral System", 
    description: "Bring in new talent through employee and partner referrals with automated tracking and rewards"
  },
  {
    icon: Zap,
    title: "Gamification and Loyalty programs",
    description: "Use our automated gamification system to reward candidates with points for engagement and applications"
  },
  {
    icon: Mail,
    title: "Broadcasts and Hiring funnels",
    description: "Maintain candidate flow and re-engage talent with tailored email sequences and nurture campaigns"
  },
  {
    icon: Database,
    title: "CRM solution",
    description: "Easily segment candidates and assign recruiters for personalized support—all from one interface"
  },
  {
    icon: LinkIcon,
    title: "Seamless integrations",
    description: "Export your data to ATS systems, Google sheets, and other third-party services on the go"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-background">
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
            Grow your talent pipeline
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Easy-to-use solutions to drive recruitment growth with AI chatbots and gamification
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Engage and Drive Sales Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 lg:mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Engage and hire effortlessly
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Automate communication and streamline your hiring process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Gamification and Loyalty programs
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Use our automated gamification system to reward your candidates with points every time they engage with your job postings and complete application steps
              </p>
              <button className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Learn more →
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/80 border border-border"
            >
              <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Broadcasts and Hiring funnels
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Maintain candidate flow and re-engage talent with tailored broadcasts and automated hiring sequences
              </p>
              <button className="text-foreground font-semibold hover:text-foreground/80 transition-colors">
                Learn more →
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Automate Communication Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 lg:mt-32 text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-16">
            Automate communication
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "AI-Powered Chatbots",
                description: "Keep in touch with your candidates 24/7 and never miss a promising lead"
              },
              {
                icon: Database,
                title: "CRM solution", 
                description: "Easily segment audiences and assign candidates for personalized support—all from one interface"
              },
              {
                icon: LinkIcon,
                title: "Seamless integrations",
                description: "Export your data to ATS systems, Google sheets, and other third-party services on the go"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;