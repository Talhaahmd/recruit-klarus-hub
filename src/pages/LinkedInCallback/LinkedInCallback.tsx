import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { linkedinAuthService } from '@/services/linkedinAuthService'; // No longer directly used here
import { Loader2 } from 'lucide-react';

const LinkedInCallback: React.FC = () => {
  const navigate = useNavigate(); // Keep for potential error navigation
  const [error, setError] = useState<string | null>(null); // Keep for displaying errors if Supabase itself fails hard on URL processing

  useEffect(() => {
    // Supabase client (initialized in AuthContext/lib) should automatically
    // detect the session from the URL when this page loads.
    // The onAuthStateChange listener in AuthContext will handle the SIGNED_IN event.

    // We can add a timeout to redirect to login if nothing happens,
    // indicating a more severe issue with the OAuth callback processing by Supabase.
    const timer = setTimeout(() => {
      // Check if we are still on this page and no error has been set.
      // This is a fallback in case the AuthContext doesn't redirect.
      if (window.location.pathname.includes('linkedin-callback') && !error) {
        console.warn('LinkedIn callback processing timed out or did not redirect. Navigating to login.');
        setError('Processing your LinkedIn login took too long. Please try again.');
        // navigate('/login?error=linkedin_timeout'); // Or show error on this page
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [navigate, error]); // Added error to dependency array

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-primary-100 hover:underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Finalizing your LinkedIn authentication...
        </p>
      </div>
    </div>
  );
};

export default LinkedInCallback; 