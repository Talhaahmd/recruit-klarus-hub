
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const LinkedInTokenCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      console.log('LinkedIn callback received:', { code: !!code, state, error });

      if (error) {
        console.error('LinkedIn OAuth error:', error);
        toast.error('LinkedIn connection failed. Please try again.');
        navigate('/jobs');
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        toast.error('LinkedIn connection failed. No authorization code received.');
        navigate('/jobs');
        return;
      }

      // Verify state parameter
      const storedState = sessionStorage.getItem('linkedin_oauth_state');
      if (state !== storedState) {
        console.error('OAuth state mismatch');
        toast.error('LinkedIn connection failed. Security verification failed.');
        navigate('/jobs');
        return;
      }

      try {
        console.log('Exchanging code for LinkedIn token...');
        
        const { data, error: functionError } = await supabase.functions.invoke('linkedin-token-store', {
          body: { code }
        });

        if (functionError) {
          console.error('Token exchange function error:', functionError);
          toast.error(`LinkedIn connection failed: ${functionError.message}`);
          navigate('/jobs');
          return;
        }

        if (data?.error) {
          console.error('Token exchange failed:', data.error);
          toast.error(`LinkedIn connection failed: ${data.error}`);
          navigate('/jobs');
          return;
        }

        console.log('LinkedIn token stored successfully');
        toast.success('LinkedIn connected successfully! You can now post jobs to LinkedIn.');
        
        // Clean up
        sessionStorage.removeItem('linkedin_oauth_state');
        
        // Redirect to jobs page with success parameter
        navigate('/jobs?linkedin_connected=true');
        
      } catch (error) {
        console.error('Unexpected error during token exchange:', error);
        toast.error('An unexpected error occurred. Please try again.');
        navigate('/jobs');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-6">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connecting LinkedIn...
          </h2>
          <p className="text-gray-600">
            Please wait while we securely connect your LinkedIn account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkedInTokenCallback;
