import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/UI/button';

interface PlanFeature {
  text: string;
  available: boolean;
}

interface PricingPlan {
  title: string;
  emoji: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  ctaText: string;
  mostPopular?: boolean;
  bgGradient: string;
}

const plans: PricingPlan[] = [
  {
    title: "Starter Plan",
    emoji: "💼",
    price: 19,
    period: "month",
    description: "Best for startups or small teams just beginning to scale hiring.",
    features: [
      { text: "20 AI interviews/month", available: true },
      { text: "2 active job role", available: true },
      { text: "CV parsing + scoring", available: true },
      { text: "Interview transcripts & summaries", available: true },
      { text: "Email support", available: true },
      { text: "Airtable or Google Sheets integration", available: true },
      { text: "70 Candidates Registry", available: true },
    ],
    ctaText: "Start Free Trial",
    bgGradient: "bg-gradient-to-r from-cyan-500/10 to-cyan-500/5"
  },
  {
    title: "Growth Plan",
    emoji: "🚀",
    price: 49,
    period: "month",
    description: "Ideal for growing companies managing multiple roles and moderate candidate volume.",
    features: [
      { text: "50 AI interviews/month", available: true },
      { text: "Up to 5 active job roles", available: true },
      { text: "Smart scoring + detailed evaluation", available: true },
      { text: "Transcripts, summaries, and ratings", available: true },
      { text: "250 Candidates Registry", available: true },
      { text: "Priority support", available: true },
    ],
    ctaText: "Get Started",
    mostPopular: true,
    bgGradient: "bg-gradient-to-r from-purple-500/20 to-cyan-500/20"
  },
  {
    title: "Enterprise Plan",
    emoji: "🏢",
    price: 79,
    period: "month",
    description: "Designed for HR teams or agencies with high-volume hiring and advanced needs.",
    features: [
      { text: "100 interviews/month", available: true },
      { text: "25 job roles", available: true },
      { text: "Custom AI prompts per role", available: true },
      { text: "Advanced analytics & dashboard", available: true },
      { text: "ATS/CRM integration (e.g. Greenhouse, Lever)", available: true },
      { text: "Dedicated success manager", available: true },
      { text: "API access & white-labeling option", available: true },
    ],
    ctaText: "Contact Sales",
    bgGradient: "bg-gradient-to-r from-blue-600/10 to-purple-500/10"
  }
];

const PlansSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  
  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.floor(monthlyPrice * 10); // 10 months for the price of 12
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-[120px] opacity-30" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[120px] opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Pricing Plans
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Choose the Right Plan for Your Needs
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Flexible pricing options to help you find and hire the best talent, no matter your company size
          </p>
          
          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 bg-gray-800 rounded-full px-1 flex items-center"
            >
              <div className={`w-5 h-5 bg-white rounded-full transform transition-all duration-300 ${isYearly ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Yearly <span className="text-cyan-500 ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl border border-gray-800 p-8 ${plan.bgGradient} transition-all duration-300 hover:border-gray-700 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 backdrop-blur-sm`}
            >
              {plan.mostPopular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-3xl mb-2">{plan.emoji}</div>
                <h3 className="text-2xl font-bold text-white">{plan.title}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold text-white">
                    ${isYearly ? getYearlyPrice(plan.price) : plan.price}
                  </span>
                  <span className="ml-1 text-xl text-gray-400">
                    /{isYearly ? 'year' : plan.period}
                  </span>
                </div>
                <p className="mt-6 text-gray-400 text-sm h-12">{plan.description}</p>
              </div>
              
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${feature.available ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gray-800'}`}>
                      <Check className={`h-4 w-4 ${feature.available ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <span className={`ml-3 text-sm ${feature.available ? 'text-gray-200' : 'text-gray-500'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Button
                  variant={plan.title === "Growth Plan" ? "default" : "outline"}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                    plan.title === "Growth Plan"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600"
                      : "border border-gray-700 text-white hover:bg-gray-800"
                  }`}
                >
                  {plan.ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Guarantee section */}
        <div className="mt-20 text-center">
          <div className="inline-block p-6 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800">
            <p className="text-lg font-medium text-white">
              Not sure which plan is right for you? Try risk-free with our 7-day money-back guarantee.
            </p>
            <p className="mt-2 text-gray-400">
              Contact our team for a personalized demo and recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
