import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { jobsService } from '@/services/jobsService';
import { useLinkedInAutoPost } from '@/hooks/useLinkedInAutoPost';

const LinkedInTokenCallback: React.FC = () => {
  const navigate = useNavigate();
  const { autoPostToLinkedIn } = useLinkedInAutoPost();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      console.log('LinkedIn callback received:', { code: !!code, state, error });

      // Default to /jobs if no source is found
      let redirectPath = '/jobs';
      let callbackSource = 'jobs';

      // Extract source from state if available
      if (state && state.includes('___')) {
        const [actualState, source] = state.split('___');
        callbackSource = source;
        
        // Map sources to redirect paths
        switch (source) {
          case 'BuildProfile':
            redirectPath = '/build-profile/success';
            break;
          case 'Jobs':
          default:
            redirectPath = '/jobs';
        }
      }

      if (error) {
        console.error('LinkedIn OAuth error:', error);
        toast.error('LinkedIn connection failed. Please try again.');
        navigate(redirectPath);
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        toast.error('LinkedIn connection failed. No authorization code received.');
        navigate(redirectPath);
        return;
      }

      // Verify state parameter - check both storage locations
      const storedState = sessionStorage.getItem('linkedin_oauth_state') || localStorage.getItem('linkedin_oauth_state');
      console.log('State verification:', { received: state, stored: storedState });
      
      if (state !== storedState) {
        console.error('OAuth state mismatch - security verification failed');
        toast.error('LinkedIn connection failed. Security verification failed.');
        navigate(redirectPath);
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
          navigate(redirectPath);
          return;
        }

        if (data?.error) {
          console.error('Token exchange failed:', data.error);
          toast.error(`LinkedIn connection failed: ${data.error}`);
          navigate(redirectPath);
          return;
        }

        console.log('LinkedIn token stored successfully');
        toast.success('LinkedIn connected successfully!');
        
        // Clean up state from both storage locations
        sessionStorage.removeItem('linkedin_oauth_state');
        localStorage.removeItem('linkedin_oauth_state');
        
        // Check for pending post data
        const pendingDataString = sessionStorage.getItem('pending_post_data');
        if (pendingDataString) {
          try {
            const pendingData = JSON.parse(pendingDataString);
            console.log('Found pending post data:', pendingData);
            sessionStorage.removeItem('pending_post_data');

            // Add delay to ensure token is properly stored
            if (pendingData.source === callbackSource) {
              setTimeout(async () => {
                                  if (pendingData.source === 'BuildProfile') {
                    // Handle BuildProfile post
                    console.log('Processing BuildProfile post with data:', pendingData.payload);
                    const { data: linkedInResponse, error } = await supabase.functions.invoke('generate-linkedin-post', {
                      body: pendingData.payload
                    });

                    if (error || linkedInResponse?.error) {
                      console.error('LinkedIn post failed after re-authentication:', error || linkedInResponse?.error);
                      toast.error('LinkedIn posting failed even after re-authentication. Please try posting manually.');
                    } else {
                      console.log('Content posted to LinkedIn successfully after re-authentication');
                      toast.success('Content posted to LinkedIn successfully!');
                      
                      // Store the post content in session storage for the success page
                      if (linkedInResponse?.content) {
                        sessionStorage.setItem('successful_linkedin_post', linkedInResponse.content);
                      }
                    }
                } else if (pendingData.source === 'Jobs' && pendingData.payload.jobId) {
                  // Handle Jobs post
                  console.log('Processing Jobs post for job:', pendingData.payload.jobId);
                  const { data: linkedInResponse, error } = await supabase.functions.invoke('auto-linkedin-post', {
                    body: { jobId: pendingData.payload.jobId }
                  });

                  if (error || linkedInResponse?.error) {
                    console.error('LinkedIn post failed after re-authentication:', error || linkedInResponse?.error);
                    toast.error('LinkedIn posting failed even after re-authentication. Please try posting manually.');
                  } else {
                    console.log('Job posted to LinkedIn successfully after re-authentication');
                    toast.success('Job posted to LinkedIn successfully!');
                  }
                }
              }, 2000); // Wait 2 seconds for token to be fully processed
            }
          } catch (error) {
            console.error('Error processing pending post data:', error);
            toast.error('Failed to process post after re-authentication');
          }
        }
        
        // Navigate back to original page
        navigate(`${redirectPath}?linkedin_connected=true`);
        
      } catch (error) {
        console.error('Unexpected error during token exchange:', error);
        toast.error('An unexpected error occurred. Please try again.');
        navigate(redirectPath);
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
            Please wait while we securely connect your LinkedIn account and process your request.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkedInTokenCallback;
