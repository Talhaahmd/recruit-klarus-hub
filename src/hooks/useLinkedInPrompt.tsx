
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { jobsService, JobInput } from '@/services/jobsService';

export const useLinkedInPrompt = () => {
  const { user, isAuthenticated } = useAuth();
  const [isCheckingToken, setIsCheckingToken] = useState(false);
  const [hasLinkedInToken, setHasLinkedInToken] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  const checkLinkedInToken = useCallback(async (forceCheck = false) => {
    if (!user || !isAuthenticated) {
      console.log('No user or not authenticated, skipping LinkedIn token check');
      setHasLinkedInToken(null);
      setShowModal(false);
      return;
    }

    setIsCheckingToken(true);
    
    try {
      console.log('Checking LinkedIn token for user:', user.id);
      const { data, error } = await supabase
        .from('linkedin_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking LinkedIn token:', error);
        setHasLinkedInToken(false);
        return;
      }

      if (data) {
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        const oneHourBuffer = 60 * 60 * 1000;
        const tokenValid = expiresAt.getTime() > (now.getTime() + oneHourBuffer);
        
        console.log('LinkedIn token found, valid:', tokenValid, 'expires:', expiresAt);
        setHasLinkedInToken(tokenValid);
        
        if (!tokenValid) {
          console.log('LinkedIn token will expire soon or has expired');
        }
      } else {
        console.log('No LinkedIn token found');
        setHasLinkedInToken(false);
      }
    } catch (error) {
      console.error('Error checking LinkedIn token:', error);
      setHasLinkedInToken(false);
    } finally {
      setIsCheckingToken(false);
    }
  }, [user, isAuthenticated]);

  const initiateLinkedInConnect = async (postData?: any) => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    try {
      console.log('Initiating fresh LinkedIn OAuth connection...');
      setShowModal(true);
      
      // Store post data with a timestamp to ensure uniqueness
      if (postData) {
        const dataWithTimestamp = {
          ...postData,
          timestamp: Date.now()
        };
        console.log('Storing post data for after OAuth:', dataWithTimestamp);
        sessionStorage.setItem('pending_post_data', JSON.stringify(dataWithTimestamp));
      }
      
      // Always clear existing LinkedIn tokens
      console.log('Clearing existing LinkedIn tokens for fresh authentication');
      try {
        const { error } = await supabase
          .from('linkedin_tokens')
          .delete()
          .eq('user_id', user.id);
        
        if (error) {
          console.warn('Error clearing existing tokens:', error);
        } else {
          console.log('Existing tokens cleared successfully');
        }
      } catch (error) {
        console.warn('Error clearing existing tokens:', error);
      }
      
      // Generate secure state value
      const state = crypto.randomUUID();
      console.log('Generated OAuth state:', state);
      
      sessionStorage.setItem('linkedin_oauth_state', state);
      localStorage.setItem('linkedin_oauth_state', state);

      const clientId = '771girpp9fv439';
      const redirectUri = encodeURIComponent('https://klarushr.com/linkedin-token-callback');
      const scope = encodeURIComponent('openid profile email w_member_social');
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

      console.log('Redirecting to LinkedIn OAuth:', authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating LinkedIn OAuth:', error);
      toast.error('Failed to initiate LinkedIn connection');
      setShowModal(false);
    }
  };

  const dismissModal = () => {
    console.log('Dismissing LinkedIn prompt modal');
    setShowModal(false);
  };

  // Handle LinkedIn connection callback and process pending data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedInConnected = urlParams.get('linkedin_connected');
    
    if (linkedInConnected === 'true') {
      console.log('LinkedIn connected callback detected...');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Reset token state
      setHasLinkedInToken(null);
      
      // Check for pending post data
      const pendingPostData = sessionStorage.getItem('pending_post_data');
      if (pendingPostData) {
        console.log('Found pending post data after LinkedIn connection');
        try {
          const jobData = JSON.parse(pendingPostData);
          sessionStorage.removeItem('pending_post_data');
          
          // Add delay to ensure token is processed
          setTimeout(() => {
            createJobWithLinkedInPosting(jobData);
          }, 3000);
        } catch (error) {
          console.error('Error parsing pending post data:', error);
          toast.error('Failed to process job data after LinkedIn connection');
        }
      } else {
        console.log('No pending post data found');
        toast.success('LinkedIn connected successfully!');
        
        // Recheck token after connection
        setTimeout(() => {
          checkLinkedInToken(true);
        }, 2000);
      }
    }
  }, [checkLinkedInToken]);

  const createJobWithLinkedInPosting = async (data: any) => {
    try {
      console.log('Creating job with LinkedIn posting after OAuth...');
      
      // Map to JobInput format
      const jobInput: JobInput = {
        title: data.title,
        description: data.description,
        location: data.location,
        type: data.type,
        workplace_type: data.workplaceType,
        technologies: data.technologies,
        status: 'Active',
        posted_date: new Date().toISOString().split('T')[0],
        active_days: data.activeDays,
        applicants: 0
      };

      console.log('Creating job with input:', jobInput);
      const createdJob = await jobsService.createJob(jobInput);
      
      if (createdJob) {
        console.log('Job created successfully:', createdJob.id);
        toast.success('Job created successfully!');
        
        // Try to auto-post to LinkedIn with proper delay
        setTimeout(async () => {
          try {
            console.log('Attempting LinkedIn auto-post...');
            const { data: linkedInResponse, error } = await supabase.functions.invoke('auto-linkedin-post', {
              body: { jobId: createdJob.id }
            });

            if (error) {
              console.error('LinkedIn auto-post error:', error);
              toast.error('Job created but LinkedIn posting failed. Please try posting manually.');
            } else if (linkedInResponse?.error) {
              console.error('LinkedIn auto-post failed:', linkedInResponse.error);
              toast.error('Job created but LinkedIn posting failed. Please try posting manually.');
            } else {
              console.log('Job created and posted to LinkedIn successfully');
              toast.success('Job created and posted to LinkedIn successfully!');
            }
          } catch (linkedInError) {
            console.error('Error posting to LinkedIn:', linkedInError);
            toast.error('Job created but LinkedIn posting failed. Please try posting manually.');
          }
          
          // Refresh the page to show the new job
          setTimeout(() => {
            window.location.href = '/jobs';
          }, 2000);
        }, 5000);
      } else {
        toast.error('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job: ' + (error as Error).message);
    }
  };

  // Reset LinkedIn token state when user changes
  useEffect(() => {
    if (user) {
      console.log('User changed, resetting LinkedIn token state for fresh check');
      setHasLinkedInToken(null);
      
      const timeoutId = setTimeout(() => {
        checkLinkedInToken(true);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setHasLinkedInToken(null);
      setShowModal(false);
    }
  }, [user?.id, checkLinkedInToken]);

  return {
    isCheckingToken,
    hasLinkedInToken,
    showModal,
    initiateLinkedInConnect,
    dismissModal,
    recheckToken: () => checkLinkedInToken(true)
  };
};
