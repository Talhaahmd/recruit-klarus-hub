import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';

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
    content: "A candidate told me our process \"felt more human than most.\" Funny how AI helped us deliver that. Klarus HR handles the details so we can focus on connection.",
    author: "Ibrahim Zardan",
    role: "CEO of @MarketingIT",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195845/1727505616238_ixlebb.jpg"
  }
];


const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { signup, loginWithGoogle, loginWithLinkedIn, isAuthenticated, isLoading, authReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = new URLSearchParams(location.search).get('from') || '/dashboard';
  const isHandlingOAuth = sessionStorage.getItem('oauth_redirect_processed') === 'true';

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (authReady && !isLoading && isAuthenticated && location.pathname === '/signup' && !isHandlingOAuth) {
      console.log('✅ Already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate, from, authReady, isHandlingOAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(name, email, password);
      toast.success('Account created! Check your email to verify.');
      navigate(`/login?from=${encodeURIComponent(from)}`, { replace: true });
    } catch (error) {
      console.error('❌ Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('🔄 Starting Google OAuth login...');
    loginWithGoogle();
  };

  const handleLinkedInLogin = () => {
    console.log('🔄 Starting LinkedIn OAuth login...');
    loginWithLinkedIn();
  };

  if (isLoading) {
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

      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Create your account
            </h1>
            <p className="text-gray-400 mt-2">Enter your email and create a password, getting started is easy!</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleGoogleLogin}
              className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 flex items-center justify-center"
            >
              <FcGoogle className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleLinkedInLogin}
              className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 flex items-center justify-center"
            >
              <FaLinkedin className="h-5 w-5 text-blue-500" />
            </Button>
            <Button 
              variant="outline" 
              type="button"
              className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 flex items-center justify-center"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-500">Or sign up with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link
              to={`/login?from=${encodeURIComponent(from)}`}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Sign in
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

export default Signup;
