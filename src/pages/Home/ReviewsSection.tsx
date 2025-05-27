import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { DraggableCard } from '@/components/UI/draggable-card';

const reviews = [
  {
    id: 1,
    name: 'Alice Johnson',
    title: 'HR Manager at Tech Solutions Inc.',
    rating: 5,
    comment: "Klarus HR has revolutionized our hiring process. The AI-driven candidate screening is incredibly efficient, saving us countless hours.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b108e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    name: 'Bob Williams',
    title: 'CEO of InnovateTech',
    rating: 4,
    comment: "The automated interview scheduling feature is a game-changer. It seamlessly integrates with our team's calendars, making coordination a breeze.",
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb7e86ef3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    title: 'CTO at FutureForward Corp',
    rating: 5,
    comment: "I'm impressed with the professional profile building tool. It helps our team members enhance their LinkedIn presence with AI-crafted content.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d674c80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 4,
    name: 'Diana Miller',
    title: 'Head of Talent Acquisition at Global Solutions',
    rating: 5,
    comment: "The real-time analytics dashboard provides invaluable insights into our hiring metrics. It's a must-have for data-driven recruitment strategies.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const ReviewsSection: React.FC = () => {
  const [shuffledReviews, setShuffledReviews] = useState([...reviews]);

  useEffect(() => {
    const shuffleReviews = () => {
      const newOrder = [...reviews].sort(() => Math.random() - 0.5);
      setShuffledReviews(newOrder);
    };

    shuffleReviews();
  }, []);

  return (
    <section id="reviews" className="py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
            Reviews
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">What Our Clients Say</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            See how Klarus HR is transforming recruitment for leading companies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shuffledReviews.map((review, index) => (
            <DraggableCard key={review.id} id={review.id.toString()} index={index}>
              <motion.div
                className="glass-card p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{review.name}</h3>
                    <p className="text-sm text-gray-400">{review.title}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i + review.rating} className="h-5 w-5 text-gray-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 flex-grow">{review.comment}</p>
              </motion.div>
            </DraggableCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
