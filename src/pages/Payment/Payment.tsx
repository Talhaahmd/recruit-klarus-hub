import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Card, CardContent } from '@/components/UI/card';
import { supabase } from '@/lib/supabase';

// Same testimonials as your signup page
const testimonials = [
  {
    content: "Honestly thought @KlarusHR would be gimmicky AI hype, but it's kind of a game changer for our small HR team. Still figuring out all the features, but initial results are strong.",
    author: "Mahad Wasique",
    role: "IAM Developer",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195844/1699147626498_g6jp1l.jpg"
  },
  {
    content: "Klarus HR has been quietly transforming how we hire. We don't have a large HR team, but this tool gives us structure and scale we didn't think was possible. The onboarding templates alone saved our team hours. It's intuitive, insightful, and genuinely supports better decision-making — not just automation for the sake of it.",
    author: "David Sanders",
    role: "Senior Recruiter",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748196046/1730632264830_ltrbgc.jpg"
  },
  {
    content: "Not gonna lie Klarus HR kind of blew me away. I fed it a job description and it generated a ranked shortlist with notes in like 5 minutes. Wild.",
    author: "Emma Sommer",
    role: "Talent Acquisition, Keenfolks",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195840/1692641403808_wiwqyr.jpg"
  },
  {
    content: "✨ Game changer for our hiring process. We started using Klarus HR about 2 months ago, and the difference is night and day.\n✅ AI-powered candidate shortlisting\n✅ Automated interview scheduling\n✅ Structured feedback tools\nNot only did we cut time-to-hire by almost 50%, we also increased candidate satisfaction. Klarus HR brings strategy and speed into one platform — highly recommend for scaling teams.",
    author: "Robert Wilson",
    role: "COO",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195840/1682575161874_atyame.jpg"
  },
  {
    content: "Small team, zero HR background Klarus HR makes us look like pros. The AI basically acts like a strategist, guiding each step with actual logic.",
    author: "Connor Kane",
    role: "Team Leader",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195840/1664309591862_hace6l.jpg"
  },
  {
    content: "Klarus HR's automated candidate ranking is a game changer. No more guessing who to prioritize. Smart, scalable, and surprisingly human in its suggestions. #HRtech",
    author: "Mahnoor",
    role: "Team Lead, Nestle",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195841/1694155351553_d1swmo.jpg"
  },
  {
    content: "@KlarusHR just flagged a perfect candidate I totally missed. It literally understands what we're looking for better than some recruiters I've worked with 👀",
    author: "Shees",
    role: "HR, National University of Science & Technology",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195846/1741182386412_bwnjyv.jpg"
  },
  {
    content: "Klarus HR doesn't just schedule interviews—it curates them. For our backend role, the system generated scenario-based questions + live coding prompts, complete with a rubric my team could tweak on the fly. We walked out of debriefs with aligned scores and crystal-clear reasoning.",
    author: "Li Zheu",
    role: "Talent Acquisition Specialist",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195847/1744922976075_n1uu1j.jpg"
  },
  {
    content: "Honestly @KlarusHR just helped us make one of our best hires ever. Faster process, better interviews, clearer feedback and we didn't have to chase anyone down.",
    author: "Chen Hao",
    role: "HR & Talent Acquisition",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195840/1662464702255_vytnra.jpg"
  },
  {
    content: "A candidate told me our process 'felt more human than most.' Funny how AI helped us deliver that. Klarus HR handles the details so we can focus on connection.",
    author: "Ibrahim Zardan",
    role: "CEO of @MarketingIT",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195845/1727505616238_ixlebb.jpg"
  }
];

const Payment: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/signup');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleStartSubscription = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout:', error);
        toast.error('Failed to create checkout session');
        return;
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Logo */}
      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center">
          <img 
            className="w-auto h-9" 
            src="/lovable-uploads/67d45eae-154d-4a02-a7a5-1f115188b97b.png" 
            alt="Klarus HR Logo" 
          />
        </Link>
      </div>

      {/* Left Side - Payment Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Complete Your Setup
            </h1>
            <p className="text-gray-400 mt-2">Start your premium experience with Klarus HR</p>
          </div>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Premium Plan</h2>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                  $19.99
                  <span className="text-lg text-gray-400 ml-1">/month</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-green-400">
                  <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-white">Unlimited CV access and storing</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-white">Unlimited active jobs</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-white">Up to 8 LinkedIn Posts per month</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-white">Up to 8 LinkedIn job posts per month</span>
                </div>
              </div>

              <Button 
                onClick={handleStartSubscription}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <CreditCard className="mr-2 h-4 w-4" />
                Start Premium Subscription
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-400">
            Secure payment powered by Stripe • Cancel anytime
          </p>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/dashboard" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Go to Dashboard
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Client Reviews */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
        
        <div className="flex flex-col items-center justify-center w-full p-12 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              What Our Clients Say
            </h2>
            <p className="text-gray-400">
              Trusted by companies worldwide
            </p>
          </div>

          <div className="max-w-lg w-full">
            <div className="relative h-80">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === currentTestimonial 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <p className="text-white font-semibold text-lg">{testimonial.author}</p>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-center">
                      <div>
                        <svg className="h-6 w-6 text-cyan-400 mb-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-white text-base leading-relaxed">
                          {testimonial.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-cyan-500 w-8' : 'bg-gray-600'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
