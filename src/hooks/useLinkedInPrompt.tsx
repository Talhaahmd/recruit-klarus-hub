
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
        // Check if token is still valid (with 1 hour buffer before actual expiry)
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        const oneHourBuffer = 60 * 60 * 1000; // 1 hour in milliseconds
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

  const initiateLinkedInConnect = (postData?: any) => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    try {
      console.log('Initiating LinkedIn OAuth connection...');
      setShowModal(true);
      
      // Store post data in sessionStorage before redirect
      if (postData) {
        console.log('Storing post data for after OAuth:', postData);
        sessionStorage.setItem('pending_post_data', JSON.stringify(postData));
      }
      
      // Clear any existing LinkedIn tokens to force fresh authentication
      console.log('Clearing existing LinkedIn tokens for fresh authentication');
      const clearTokensPromise = supabase
        .from('linkedin_tokens')
        .delete()
        .eq('user_id', user.id);
      
      // Handle the promise properly
      clearTokensPromise.then(() => {
        console.log('Existing tokens cleared');
      });
      
      // Generate secure state value and store it properly
      const state = crypto.randomUUID();
      console.log('Generated OAuth state:', state);
      
      // Store state in both sessionStorage and localStorage for redundancy
      sessionStorage.setItem('linkedin_oauth_state', state);
      localStorage.setItem('linkedin_oauth_state', state);

      // Use the updated scope that includes profile and email access
      const clientId = '771girpp9fv439';
      const redirectUri = encodeURIComponent('https://klarushr.com/linkedin-token-callback');
      const scope = encodeURIComponent('openid profile email w_member_social');
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

      console.log('Redirecting to LinkedIn OAuth:', authUrl);
      
      // Redirect immediately
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

  // Check for LinkedIn connection callback and handle post data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedInConnected = urlParams.get('linkedin_connected');
    
    if (linkedInConnected === 'true') {
      console.log('LinkedIn connected callback detected...');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Recheck token with force
      setTimeout(() => {
        checkLinkedInToken(true);
      }, 1000);
      
      // Check for pending post data and create job
      const pendingPostData = sessionStorage.getItem('pending_post_data');
      if (pendingPostData) {
        console.log('Found pending post data after LinkedIn connection');
        const jobData = JSON.parse(pendingPostData);
        sessionStorage.removeItem('pending_post_data');
        
        // Create job with LinkedIn posting
        createJobWithLinkedInPosting(jobData);
      } else {
        toast.success('LinkedIn connected successfully!');
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

      const createdJob = await jobsService.createJob(jobInput);
      if (createdJob) {
        // Try to auto-post to LinkedIn with a longer delay to ensure fresh token is ready
        setTimeout(async () => {
          try {
            const { data: linkedInResponse, error } = await supabase.functions.invoke('auto-linkedin-post', {
              body: { jobId: createdJob.id }
            });

            if (error) {
              console.error('LinkedIn auto-post error:', error);
              toast.success('Job created successfully, but LinkedIn posting failed. Please try posting manually.');
            } else if (linkedInResponse?.error) {
              console.error('LinkedIn auto-post failed:', linkedInResponse.error);
              toast.success('Job created successfully, but LinkedIn posting failed. Please try posting manually.');
            } else {
              console.log('Job created and posted to LinkedIn successfully');
              toast.success('Job created and posted to LinkedIn successfully!');
            }
          } catch (linkedInError) {
            console.error('Error posting to LinkedIn:', linkedInError);
            toast.success('Job created successfully, but LinkedIn posting failed. Please try posting manually.');
          }
        }, 5000); // Increased to 5 seconds for token processing
        
        // Refresh page to show new job
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    }
  };

  // Reset LinkedIn token state when user changes
  useEffect(() => {
    if (user) {
      console.log('User changed, resetting LinkedIn token state for fresh check');
      setHasLinkedInToken(null);
      
      // Add a delay to ensure auth state is stable
      const timeoutId = setTimeout(() => {
        checkLinkedInToken(true);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setHasLinkedInToken(null);
      setShowModal(false);
    }
  }, [user?.id, checkLinkedInToken]); // Watch user.id specifically for account switches

  return {
    isCheckingToken,
    hasLinkedInToken,
    showModal,
    initiateLinkedInConnect,
    dismissModal,
    recheckToken: () => checkLinkedInToken(true) // Force recheck
  };
};
