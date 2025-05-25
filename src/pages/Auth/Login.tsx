
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const testimonials = [
  {
    content: "Honestly thought @KlarusHR would be gimmicky AI hype, but it's kind of a game changer for our small HR team. Still figuring out all the features, but initial results are strong.",
    author: "Mahad Wasique",
    role: "IAM Developer",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195844/1699147626498_g6jp1l.jpg"
  },
  {
    content: "Klarus HR has been quietly transforming how we hire. We don’t have a large HR team, but this tool gives us structure and scale we didn’t think was possible. The onboarding templates alone saved our team hours. It’s intuitive, insightful, and genuinely supports better decision-making — not just automation for the sake of it.",
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
    content: "Klarus HR’s automated candidate ranking is a game changer. No more guessing who to prioritize. Smart, scalable, and surprisingly human in its suggestions. #HRtech",
    author: "Mahnoor",
    role: "Team Lead, Nestle",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195841/1694155351553_d1swmo.jpg"
  },
  {
    content: "@KlarusHR just flagged a perfect candidate I totally missed. It literally understands what we’re looking for better than some recruiters I’ve worked with 👀",
    author: "Shees",
    role: "HR, National University of Science & Technology",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195846/1741182386412_bwnjyv.jpg"
  },
  {
    content: "Klarus HR doesn’t just schedule interviews—it curates them. For our backend role, the system generated scenario-based questions + live coding prompts, complete with a rubric my team could tweak on the fly. We walked out of debriefs with aligned scores and crystal-clear reasoning.",
    author: "Li Zheu",
    role: "Talent Acquisition Specialist",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195847/1744922976075_n1uu1j.jpg"
  },
  {
    content: "Honestly @KlarusHR just helped us make one of our best hires ever. Faster process, better interviews, clearer feedback and we didn’t have to chase anyone down.",
    author: "Chen Hao",
    role: "HR & Talent Acquisition",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195840/1662464702255_vytnra.jpg"
  },
  {
    content: "A candidate told me our process “felt more human than most.” Funny how AI helped us deliver that. Klarus HR handles the details so we can focus on connection.",
    author: "Ibrahim Zardan",
    role: "CEO of @MarketingIT",
    image: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748195845/1727505616238_ixlebb.jpg"
  }
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { login, loginWithGoogle, loginWithLinkedIn, isAuthenticated, isLoading, authReady } = useAuth();
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
    // Improved authentication state handling for mobile
    if (authReady && !isLoading && isAuthenticated && location.pathname === '/login' && !isHandlingOAuth) {
      console.log('✅ Already authenticated, redirecting to:', from);
      // Use a slight delay to ensure the auth state is fully stabilized
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [isLoading, isAuthenticated, navigate, from, location.pathname, authReady, isHandlingOAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      console.log('✅ Login successful, redirecting...');
      // Use a small delay to ensure auth state is updated
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    } catch (error) {
      console.error('❌ Login failed');
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

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link to="/reset-password" className="text-sm text-cyan-400 hover:text-cyan-300">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-500">Or sign in with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleGoogleLogin}
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleLinkedInLogin}
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
              >
                <FaLinkedin className="mr-2 h-4 w-4 text-blue-500" />
                LinkedIn
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign up
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

export default Login;
