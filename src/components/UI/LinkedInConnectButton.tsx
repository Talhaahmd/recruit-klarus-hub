
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Linkedin, CheckCircle, Loader2 } from 'lucide-react';

const LinkedInConnectButton: React.FC = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if LinkedIn is already connected
  useEffect(() => {
    const checkLinkedInConnection = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('linkedin_tokens')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking LinkedIn connection:', error);
        } else if (data) {
          // Check if token is still valid
          const expiresAt = new Date(data.expires_at);
          const now = new Date();
          setIsConnected(expiresAt > now);
        }
      } catch (error) {
        console.error('Error checking LinkedIn connection:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkLinkedInConnection();
  }, [user]);

  const handleConnectLinkedIn = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setIsLoading(true);

    try {
      // Generate state for security
      const state = crypto.randomUUID();
      sessionStorage.setItem('linkedin_oauth_state', state);

      // Use the correct LinkedIn API v2 scopes that are actually supported
      const clientId = '771girpp9fv439';
      const redirectUri = encodeURIComponent('https://klarushr.com/linkedin-token-callback');
      // Updated to use supported scopes: profile (basic profile), email, and w_member_social for posting
      const scope = encodeURIComponent('profile email w_member_social');
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

      console.log('Redirecting to LinkedIn OAuth with updated scopes:', authUrl);
      // Redirect to LinkedIn
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating LinkedIn OAuth:', error);
      toast.error('Failed to initiate LinkedIn connection');
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <Button disabled variant="outline" className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking connection...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <Button disabled variant="outline" className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-4 w-4" />
        LinkedIn Connected
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleConnectLinkedIn}
      disabled={isLoading}
      className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#005885] text-white"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Linkedin className="h-4 w-4" />
      )}
      {isLoading ? 'Connecting...' : 'Connect LinkedIn for Posting'}
    </Button>
  );
};

export default LinkedInConnectButton;
