
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
    try {
      console.log('Initiating LinkedIn OAuth connection...');
      
      // Generate secure state value
      const state = crypto.randomUUID();
      sessionStorage.setItem('linkedin_oauth_state', state);
      console.log('Generated OAuth state:', state);

      // Construct LinkedIn OAuth URL with exact parameters
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=771girpp9fv439&redirect_uri=https://klarushr.com/linkedin-token-callback&scope=r_liteprofile%20r_emailaddress%20w_member_social&state=${state}`;

      console.log('Redirecting to LinkedIn OAuth:', authUrl);
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

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, checking LinkedIn token...');
      checkLinkedInToken();
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
