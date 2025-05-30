
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
        // Use 10 minute buffer instead of 1 hour for more accurate checking
        const tenMinuteBuffer = 10 * 60 * 1000;
        const tokenValid = expiresAt.getTime() > (now.getTime() + tenMinuteBuffer);
        
        console.log('LinkedIn token found, valid:', tokenValid, 'expires:', expiresAt);
        setHasLinkedInToken(tokenValid);
        
        if (!tokenValid) {
          console.log('LinkedIn token will expire soon or has expired');
          // Clear the expired token from the database
          try {
            await supabase
              .from('linkedin_tokens')
              .delete()
              .eq('user_id', user.id);
            console.log('Cleared expired LinkedIn token');
          } catch (deleteError) {
            console.warn('Error clearing expired token:', deleteError);
          }
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

  const initiateLinkedInConnect = async (options?: { callbackSource?: string, postData?: any }) => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    const callbackSource = options?.callbackSource || 'unknown';
    const postData = options?.postData;

    try {
      console.log(`Initiating fresh LinkedIn OAuth connection (source: ${callbackSource})...`);
      setShowModal(true);
      
      if (postData) {
        const dataWithTimestamp = {
          payload: postData,
          source: callbackSource,
          timestamp: Date.now()
        };
        console.log('Storing data for after OAuth:', dataWithTimestamp);
        sessionStorage.setItem('pending_post_data', JSON.stringify(dataWithTimestamp));
      }
      
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
      
      const state = crypto.randomUUID();
      const stateWithSource = `${state}___${callbackSource}`;
      console.log('Generated OAuth state with source:', stateWithSource);
      
      sessionStorage.setItem('linkedin_oauth_state', stateWithSource);
      localStorage.setItem('linkedin_oauth_state', stateWithSource);

      const clientId = '771girpp9fv439';
      const redirectUri = encodeURIComponent('https://klarushr.com/linkedin-token-callback');
      const scope = encodeURIComponent('openid profile email w_member_social');
      
      // Force fresh consent by adding prompt=consent
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${stateWithSource}&prompt=consent`;

      console.log('Redirecting to LinkedIn OAuth with fresh consent:', authUrl);
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedInConnected = urlParams.get('linkedin_connected');
    
    if (linkedInConnected === 'true') {
      console.log(`LinkedIn connected callback detected. Global handler in useLinkedInPrompt.`);
      
      window.history.replaceState({}, document.title, window.location.pathname);
      setHasLinkedInToken(null);
      
      toast.success('LinkedIn connected successfully!');

      const recheckTimer = setTimeout(() => {
        console.log('useLinkedInPrompt: Re-checking LinkedIn token after connection.');
        checkLinkedInToken(true);
      }, 1500);

      return () => clearTimeout(recheckTimer);
    }
  }, [checkLinkedInToken]);

  const createJobWithLinkedInPosting = async (jobPayload: any) => {
    try {
      console.log('Creating job with LinkedIn posting after OAuth...');
      
      const jobInput: JobInput = {
        title: jobPayload.title,
        description: jobPayload.description,
        location: jobPayload.location,
        type: jobPayload.type,
        workplace_type: jobPayload.workplaceType,
        technologies: jobPayload.technologies,
        status: 'Active',
        posted_date: new Date().toISOString().split('T')[0],
        active_days: jobPayload.activeDays,
        applicants: 0
      };

      console.log('Creating job with input:', jobInput);
      const createdJob = await jobsService.createJob(jobInput);
      
      if (createdJob) {
        console.log('Job created successfully:', createdJob.id);
        toast.success('Job created successfully!');
        
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
