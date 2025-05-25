
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

      // Verify state parameter - check both storage locations
      const storedState = sessionStorage.getItem('linkedin_oauth_state') || localStorage.getItem('linkedin_oauth_state');
      console.log('State verification:', { received: state, stored: storedState });
      
      if (state !== storedState) {
        console.error('OAuth state mismatch - security verification failed');
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
        toast.success('LinkedIn connected successfully!');
        
        // Clean up state from both storage locations
        sessionStorage.removeItem('linkedin_oauth_state');
        localStorage.removeItem('linkedin_oauth_state');
        
        // Check for pending data and determine the source
        const pendingJobData = sessionStorage.getItem('pending_job_data');
        const pendingPostData = sessionStorage.getItem('pending_post_data');
        
        // Handle BuildProfile post data first
        if (pendingPostData) {
          console.log('Found pending post data, checking source...');
          try {
            const postData = JSON.parse(pendingPostData);
            
            // Check if this is BuildProfile data
            if (postData.source === 'BuildProfile') {
              console.log('Processing BuildProfile post generation...');
              sessionStorage.removeItem('pending_post_data');
              
              // Redirect to BuildProfile with success parameter
              navigate('/build-profile?linkedin_connected=true');
              return;
            }
          } catch (error) {
            console.error('Error parsing pending post data:', error);
          }
        }
        
        // Handle job posting data
        if (pendingJobData) {
          console.log('Found pending job data, creating job...');
          
          try {
            const jobData = JSON.parse(pendingJobData);
            sessionStorage.removeItem('pending_job_data');
            
            // Create the job
            const jobPayload = {
              title: jobData.title,
              description: jobData.description,
              location: jobData.location,
              type: jobData.type,
              status: 'Active',
              posted_date: new Date().toISOString().split('T')[0],
              active_days: jobData.activeDays,
              technologies: jobData.technologies,
              workplace_type: jobData.workplaceType,
              applicants: 0
            };

            console.log('Creating job with payload:', jobPayload);
            const savedJob = await jobsService.createJob(jobPayload);

            if (savedJob) {
              console.log('Job created successfully:', savedJob);
              toast.success('Job created successfully');
              
              // Auto-post to LinkedIn with fresh token - add delay to ensure token is ready
              console.log('Attempting LinkedIn auto-post with fresh token...');
              setTimeout(async () => {
                const linkedInSuccess = await autoPostToLinkedIn(savedJob.id);
                
                if (linkedInSuccess) {
                  console.log('LinkedIn auto-post completed successfully');
                  toast.success('Job posted to LinkedIn successfully!');
                } else {
                  console.log('LinkedIn auto-post failed, but job was created');
                  toast.error('Job created but LinkedIn posting failed. You can try posting manually.');
                }
              }, 2000); // Wait 2 seconds for token to be fully processed
            } else {
              console.error('Job creation failed - no job returned');
              toast.error('Failed to create job');
            }
          } catch (parseError) {
            console.error('Error parsing pending job data:', parseError);
            toast.error('Failed to create job after LinkedIn connection');
          }
          
          // Redirect to jobs page with success parameter
          navigate('/jobs?linkedin_connected=true');
          return;
        }
        
        // No pending data, default to jobs page
        navigate('/jobs?linkedin_connected=true');
        
      } catch (error) {
        console.error('Unexpected error during token exchange:', error);
        toast.error('An unexpected error occurred. Please try again.');
        navigate('/jobs');
      }
    };

    handleCallback();
  }, [navigate, autoPostToLinkedIn]);

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
