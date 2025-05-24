
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LinkedInSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, loginWithGoogle, loginWithLinkedIn, isAuthenticated, isLoading, authReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHandlingOAuth = sessionStorage.getItem('oauth_redirect_processed') === 'true';

  useEffect(() => {
    if (authReady && !isLoading && isAuthenticated && location.pathname === '/linkedin-signup' && !isHandlingOAuth) {
      console.log('✅ Already authenticated, redirecting to LinkedIn Zero dashboard');
      navigate('/linkedin-dashboard', { replace: true });
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate, authReady, isHandlingOAuth]);

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
      navigate('/linkedin-login', { replace: true });
    } catch (error) {
      console.error('❌ Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('🔄 Starting Google OAuth login...');
    sessionStorage.setItem('linkedin_mode', 'true');
    loginWithGoogle();
  };

  const handleLinkedInLogin = () => {
    console.log('🔄 Starting LinkedIn OAuth login...');
    sessionStorage.setItem('linkedin_mode', 'true');
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
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

      <div className="w-full max-w-md px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            LinkedIn Zero
          </h1>
          <p className="text-gray-400 mt-2">Create engaging LinkedIn content with AI</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            variant="outline" 
            type="button" 
            onClick={handleGoogleLogin}
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 flex items-center justify-center"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            onClick={handleLinkedInLogin}
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 flex items-center justify-center"
          >
            <FaLinkedin className="mr-2 h-4 w-4 text-blue-500" />
            LinkedIn
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-500">Or sign up with email</span>
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
            Get Started
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link
            to="/linkedin-login"
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LinkedInSignup;
