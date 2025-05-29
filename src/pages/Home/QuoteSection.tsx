import React, { useEffect, useRef } from 'react';

const quotes = [
  {
    text: "AI doesn't replace recruiters, it empowers them to find the right talent faster and make better hiring decisions.",
    author: "Alex Johnson",
    title: "CEO & Founder"
  },
  {
    text: "The future of recruitment isn't about reviewing more resumes, it's about matching the right people to the right roles.",
    author: "Sarah Williams",
    title: "CTO"
  },
  {
    text: "AI in recruiting isn't just a technological advancement, it's a fundamental shift in how we connect talent with opportunity.",
    author: "David Chen",
    title: "Head of Product"
  }
];

const QuoteSection: React.FC = () => {
  const [currentQuote, setCurrentQuote] = React.useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (sectionTop < windowHeight * 0.75) {
        section.classList.add('opacity-100');
        section.classList.remove('opacity-0', 'translate-y-10');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-black transition-all duration-1000 transform opacity-0 translate-y-10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block mb-4 text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </span>

          <div className="relative h-48">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentQuote
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
              >
                <p className="text-2xl md:text-3xl text-gray-100 font-light italic leading-relaxed max-w-3xl mx-auto">
                  “{quote.text}”
                </p>
                <div className="mt-6">
                  <p className="text-white font-semibold">{quote.author}</p>
                  <p className="text-sm text-gray-400">{quote.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote navigation dots */}
          <div className="flex justify-center mt-10 space-x-2">
            {quotes.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentQuote
                    ? 'bg-blue-500 w-6'
                    : 'bg-gray-600 w-2'
                }`}
                onClick={() => setCurrentQuote(index)}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
