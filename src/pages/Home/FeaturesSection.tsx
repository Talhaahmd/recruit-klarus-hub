
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Users, Zap, BarChart3, Shield } from 'lucide-react';

const features = [
  {
    icon: <Clock className="w-8 h-8" />,
    title: "60-Second Interviews",
    description: "From CV upload to interview completion in under a minute",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Smart Candidate Matching",
    description: "AI-powered matching to find the perfect candidates for your roles",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Automated Screening",
    description: "Intelligent screening process that saves hours of manual work",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into your hiring process and candidate pipeline",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Quality Assessment",
    description: "Advanced AI evaluation to ensure you get the best candidates",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with full GDPR compliance",
    bgColor: "bg-red-50",
    iconColor: "text-red-600"
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Powerful Features for Modern Hiring
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Everything you need to streamline your recruitment process and find the perfect candidates faster than ever before.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={feature.iconColor}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
