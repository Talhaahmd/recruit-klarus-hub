import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { linkedinAuthService } from '@/services/linkedinAuthService';
import { Loader2 } from 'lucide-react';

const LinkedInCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await linkedinAuthService.handleCallback();
        // Redirect to dashboard after successful login and profile sync
        navigate('/dashboard');
      } catch (err) {
        console.error('Error handling LinkedIn callback:', err);
        setError('Failed to complete LinkedIn authentication. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

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
          Completing LinkedIn authentication...
        </p>
      </div>
    </div>
  );
};

export default LinkedInCallback; 