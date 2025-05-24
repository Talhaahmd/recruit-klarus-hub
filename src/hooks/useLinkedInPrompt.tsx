
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useLinkedInPrompt = () => {
  const { user, isAuthenticated } = useAuth();
  const [isCheckingToken, setIsCheckingToken] = useState(false);
  const [hasLinkedInToken, setHasLinkedInToken] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  const checkLinkedInToken = async () => {
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
        setShowModal(true);
        return;
      }

      if (data) {
        // Check if token is still valid
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        const tokenValid = expiresAt > now;
        console.log('LinkedIn token found, valid:', tokenValid, 'expires:', expiresAt);
        setHasLinkedInToken(tokenValid);
        
        if (!tokenValid) {
          console.log('LinkedIn token expired, prompting for reconnection');
          setShowModal(true);
        } else {
          setShowModal(false);
        }
      } else {
        console.log('No LinkedIn token found, prompting for connection');
        setHasLinkedInToken(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error checking LinkedIn token:', error);
      setHasLinkedInToken(false);
      setShowModal(true);
    } finally {
      setIsCheckingToken(false);
    }
  };

  const initiateLinkedInConnect = () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    try {
      console.log('Initiating LinkedIn OAuth connection...');
      
      // Generate secure state value
      const state = crypto.randomUUID();
      sessionStorage.setItem('linkedin_oauth_state', state);
      console.log('Generated OAuth state:', state);

      // Use the correct LinkedIn API v2 scopes
      const clientId = '771girpp9fv439';
      const redirectUri = encodeURIComponent('https://klarushr.com/linkedin-token-callback');
      // Updated to use supported scopes: profile, email, and w_member_social
      const scope = encodeURIComponent('profile email w_member_social');
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

      console.log('Redirecting to LinkedIn OAuth with corrected scopes:', authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating LinkedIn OAuth:', error);
      toast.error('Failed to initiate LinkedIn connection');
    }
  };

  const dismissModal = () => {
    console.log('Dismissing LinkedIn prompt modal');
    setShowModal(false);
  };

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
  }, [isAuthenticated, user]);

  return {
    isCheckingToken,
    hasLinkedInToken,
    showModal,
    initiateLinkedInConnect,
    dismissModal,
    recheckToken: checkLinkedInToken
  };
};
