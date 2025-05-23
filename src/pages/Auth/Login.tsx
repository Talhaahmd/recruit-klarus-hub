
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
    content: "The AI-driven interviews have revolutionized our hiring process. We're finding better candidates in half the time it used to take us.",
    author: "Sarah Johnson",
    role: "HR Director, TechFront Inc.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    content: "We've reduced our time-to-hire by 40% and our retention rates have improved significantly. The AI interview platform has become an essential part of our recruiting toolkit.",
    author: "Michael Chen",
    role: "Talent Acquisition Lead, GlobalTech",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    content: "The analytics and insights we get from each interview have been invaluable. It's like having an expert interviewer on our team 24/7.",
    author: "Emily Rodriguez",
    role: "CEO, StartupVision",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    content: "Our hiring managers are now able to focus on the highest-potential candidates, rather than spending hours screening. The ROI has been excellent.",
    author: "David Washington",
    role: "COO, Enterprise Solutions",
    image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    content: "As a fast-growing startup, we needed a solution that could scale with us. This platform has allowed us to maintain high hiring standards while doubling our team size in six months.",
    author: "Priya Patel",
    role: "Recruiting Manager, NextGen Software",
    image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
    if (authReady && !isLoading && isAuthenticated && location.pathname === '/login' && !isHandlingOAuth) {
      console.log('✅ Already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
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
      navigate(from, { replace: true });
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
