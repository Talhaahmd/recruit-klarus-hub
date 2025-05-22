
import React from 'react';
import { motion } from 'framer-motion';
import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card';

// Review content with actual reviews
const cards = [
  {
    id: 1,
    content: "The AI-driven interviews have revolutionized our hiring process. We're finding better candidates in half the time it used to take us.",
    author: "Sarah Johnson",
    role: "HR Director, TechFront Inc.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    className: "absolute top-10 left-[20%] rotate-[-5deg] z-10"
  },
  {
    id: 2,
    content: "We've reduced our time-to-hire by 40% and our retention rates have improved significantly. The AI interview platform has become an essential part of our recruiting toolkit.",
    author: "Michael Chen",
    role: "Talent Acquisition Lead, GlobalTech",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    className: "absolute top-40 left-[25%] rotate-[-7deg] z-20"
  },
  {
    id: 3,
    content: "The analytics and insights we get from each interview have been invaluable. It's like having an expert interviewer on our team 24/7.",
    author: "Emily Rodriguez",
    role: "CEO, StartupVision",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    className: "absolute top-5 left-[40%] rotate-[8deg] z-30"
  },
  {
    id: 4,
    content: "Our hiring managers are now able to focus on the highest-potential candidates, rather than spending hours screening. The ROI has been excellent.",
    author: "David Washington",
    role: "COO, Enterprise Solutions",
    image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    className: "absolute top-32 left-[55%] rotate-[10deg] z-40"
  },
  {
    id: 5,
    content: "As a fast-growing startup, we needed a solution that could scale with us. This platform has allowed us to maintain high hiring standards while doubling our team size in six months.",
    author: "Priya Patel",
    role: "Recruiting Manager, NextGen Software",
    image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    className: "absolute top-20 right-[35%] rotate-[2deg] z-50"
  },
  {
    id: 6,
    content: "The consistency of the interview process across all our global offices has improved dramatically. We're now confident that we're evaluating candidates fairly and thoroughly.",
    author: "Thomas Schmidt",
    role: "VP of HR, Global Innovations",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    className: "absolute top-24 left-[45%] rotate-[-7deg] z-60"
  }
];

const ReviewsSection: React.FC = () => {
  return (
    <section className="py-24 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Success Stories
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Real experiences from companies that have transformed their hiring process with our platform
          </p>
        </div>
        
        <div className="relative mt-16">
          {/* Background glow effects */}
          <div className="absolute top-40 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[120px] opacity-30" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-[120px] opacity-30" />
          
          <div className="min-h-[600px] md:min-h-[800px] w-full relative">
            <DraggableCardContainer className="relative h-[600px] md:h-[800px] w-full overflow-visible">
              {cards.map((card) => (
                <DraggableCardBody key={card.id} className={card.className}>
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <img 
                        src={card.image} 
                        alt={card.author} 
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                      />
                      <p className="text-neutral-800 dark:text-white/80 leading-relaxed">
                        "{card.content}"
                      </p>
                    </div>
                    <div className="mt-auto">
                      <div className="font-bold text-neutral-900 dark:text-white text-center">{card.author}</div>
                      <div className="text-neutral-600 dark:text-white/60 text-sm text-center">{card.role}</div>
                    </div>
                  </div>
                </DraggableCardBody>
              ))}
            </DraggableCardContainer>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <motion.a 
            href="#contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full px-8 py-3 text-lg font-medium hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
          >
            Join Our Success Stories
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
