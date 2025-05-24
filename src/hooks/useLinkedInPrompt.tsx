
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useLinkedInPrompt = () => {
  const { user, isAuthenticated } = useAuth();
  const [isCheckingToken, setIsCheckingToken] = useState(false);
  const [hasLinkedInToken, setHasLinkedInToken] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tokenCheckCache, setTokenCheckCache] = useState<{ [key: string]: { valid: boolean, timestamp: number } }>({});

  const checkLinkedInToken = useCallback(async (forceCheck = false) => {
    if (!user || !isAuthenticated) {
      console.log('No user or not authenticated, skipping LinkedIn token check');
      setHasLinkedInToken(null);
      setShowModal(false);
      return;
    }

    // Use cache if available and not forced check (cache for 5 minutes)
    const cacheKey = user.id;
    const cachedResult = tokenCheckCache[cacheKey];
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes
    
    if (!forceCheck && cachedResult && (Date.now() - cachedResult.timestamp) < cacheExpiry) {
      console.log('Using cached LinkedIn token status:', cachedResult.valid);
      setHasLinkedInToken(cachedResult.valid);
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
        setTokenCheckCache(prev => ({
          ...prev,
          [cacheKey]: { valid: false, timestamp: Date.now() }
        }));
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
        
        // Cache the result
        setTokenCheckCache(prev => ({
          ...prev,
          [cacheKey]: { valid: tokenValid, timestamp: Date.now() }
        }));
        
        if (!tokenValid) {
          console.log('LinkedIn token will expire soon or has expired');
        }
      } else {
        console.log('No LinkedIn token found');
        setHasLinkedInToken(false);
        setTokenCheckCache(prev => ({
          ...prev,
          [cacheKey]: { valid: false, timestamp: Date.now() }
        }));
      }
    } catch (error) {
      console.error('Error checking LinkedIn token:', error);
      setHasLinkedInToken(false);
      setTokenCheckCache(prev => ({
        ...prev,
        [cacheKey]: { valid: false, timestamp: Date.now() }
      }));
    } finally {
      setIsCheckingToken(false);
    }
  }, [user, isAuthenticated, tokenCheckCache]);

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
      
      // Generate secure state value and store it properly
      const state = crypto.randomUUID();
      console.log('Generated OAuth state:', state);
      
      // Store state in both sessionStorage and localStorage for redundancy
      sessionStorage.setItem('linkedin_oauth_state', state);
      localStorage.setItem('linkedin_oauth_state', state);

      // Use basic supported scopes
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
      
      // Clear cache and force recheck
      setTokenCheckCache({});
      
      // Recheck token with force
      setTimeout(() => {
        checkLinkedInToken(true);
      }, 1000);
      
      // Check for pending post data
      const pendingPostData = sessionStorage.getItem('pending_post_data');
      if (pendingPostData) {
        console.log('Found pending post data after LinkedIn connection');
        sessionStorage.removeItem('pending_post_data');
        toast.success('LinkedIn connected! Processing your post...');
      } else {
        toast.success('LinkedIn connected successfully!');
      }
    }
  }, [checkLinkedInToken]);

  // Only check token when user is authenticated and we have a valid user
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, checking LinkedIn token...');
      // Add a small delay to ensure auth state is stable
      const timeoutId = setTimeout(() => {
        checkLinkedInToken();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setHasLinkedInToken(null);
      setShowModal(false);
    }
  }, [isAuthenticated, user, checkLinkedInToken]);

  return {
    isCheckingToken,
    hasLinkedInToken,
    showModal,
    initiateLinkedInConnect,
    dismissModal,
    recheckToken: () => checkLinkedInToken(true) // Force recheck
  };
};
