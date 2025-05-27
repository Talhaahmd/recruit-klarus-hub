import { supabase } from '@/lib/supabase';
import { linkedinProfileService } from './linkedinProfileService';
import { toast } from 'sonner';

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

export const linkedinAuthService = {
  // Sign in with LinkedIn
  signInWithLinkedIn: async () => {
    try {
      // Clear any existing session first
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          scopes: [
            'openid',
            'profile',
            'email',
            'r_basicprofile',
            'r_1st_connections_size',
            'r_ads',
            'r_ads_reporting',
            'r_organization_social',
            'r_organization_admin',
            'w_member_social',
            'w_organization_social',
            'rw_organization_admin',
            'rw_ads'
          ].join(' '),
          redirectTo: `${window.location.origin}/linkedin-callback`,
          queryParams: {
            auth_type: 'reauthenticate'  // Force LinkedIn to show consent screen
          }
        }
      });

      if (error) {
        console.error('LinkedIn OAuth error:', error);
        toast.error('Failed to connect with LinkedIn');
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error signing in with LinkedIn:', error);
      toast.error('Failed to sign in with LinkedIn');
      throw error;
    }
  },

  // Fetch LinkedIn profile data using access token
  fetchLinkedInProfile: async (access_token: string) => {
    try {
      if (!access_token) {
        throw new Error('No access token provided');
      }

      // Fetch basic profile information
      const profileResponse = await fetch(`${LINKEDIN_API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch LinkedIn profile');
      }
      
      const profileData = await profileResponse.json();

      // Fetch profile picture
      const pictureResponse = await fetch(`${LINKEDIN_API_URL}/me?projection=(id,profilePicture(displayImage~:playableStreams))`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (!pictureResponse.ok) {
        console.warn('Failed to fetch LinkedIn profile picture');
      }
      
      const pictureData = await pictureResponse.json();
      const profilePicture = pictureData.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier || null;

      // Fetch email address
      const emailResponse = await fetch(`${LINKEDIN_API_URL}/emailAddress?q=members&projection=(elements*(handle~))`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (!emailResponse.ok) {
        console.warn('Failed to fetch LinkedIn email');
      }
      
      const emailData = await emailResponse.json();

      // Fetch network size
      const networkResponse = await fetch(`${LINKEDIN_API_URL}/connections?q=viewer&start=0&count=0`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      let connectionCount = 0;
      if (networkResponse.ok) {
        const networkData = await networkResponse.json();
        connectionCount = networkData._total || 0;
      }

      return {
        linkedinId: profileData.id,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName,
        profilePicture,
        email: emailData.elements?.[0]?.['handle~']?.emailAddress,
        connectionCount
      };
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      throw error;
    }
  },

  // Handle LinkedIn OAuth callback and update profile
  handleCallback: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.provider_token) {
        toast.error('No LinkedIn access token found');
        throw new Error('No provider token found');
      }

      // Fetch LinkedIn profile data
      const linkedinData = await linkedinAuthService.fetchLinkedInProfile(session.provider_token);

      // Update profile in database
      await linkedinProfileService.updateProfile({
        full_name: `${linkedinData.firstName} ${linkedinData.lastName}`,
        profile_image: linkedinData.profilePicture,
        connection_count: linkedinData.connectionCount
      });

      toast.success('LinkedIn profile updated successfully');
      return linkedinData;
    } catch (error) {
      console.error('Error handling LinkedIn callback:', error);
      toast.error('Failed to complete LinkedIn authentication');
      throw error;
    }
  }
}; 