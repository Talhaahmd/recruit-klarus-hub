import { supabase } from '@/lib/supabase';
import { linkedinProfileService } from './linkedinProfileService';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';

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
          redirectTo: `${window.location.origin}/dashboard`,
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

      // Fetch basic profile information, headline, vanityName (for profile_url), current position
      // Docs: https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api?context=linkedin/compliance/context#schema
      // Includes: id, localizedFirstName, localizedLastName, profilePicture(displayImage~:playableStreams),
      // headline(localized), currentShare.author.vanityName (for profile URL - needs confirmation)
      // It's hard to get a precise list of available "basic profile" fields without specific permissions.
      // We'll try a common set and add more specific projections if needed.
      const profileFields = [
        'id',
        'localizedFirstName',
        'localizedLastName',
        'vanityName', // Often used for profile URL slug
        // 'profilePicture(displayImage~:playableStreams)', // Fetched separately for more control
        'headline', // headline is a top-level field with localized versions
        // For current position and company, it's usually part of a positions object
        // 'positions(summary,title,company(name))' // Example, may need adjustment
        // For bio/summary:
        // 'summary' or 'aboutMeVersion(localizedSummary)' // These are common but need API version check
        'summary', // Adding summary for bio
        'positionsV2(elements(startYear,startMonth,endYear,endMonth,title,companyName,company(name)))' // Adding positions for current role
      ].join(',');

      const profileResponse = await fetch(`${LINKEDIN_API_URL}/me?projection=(${profileFields})`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': '202305' // Example, use a recent, supported version
        }
      });
      
      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Failed to fetch LinkedIn profile:', profileResponse.status, errorText);
        throw new Error(`Failed to fetch LinkedIn profile: ${profileResponse.status}`);
      }
      
      const profileData = await profileResponse.json();

      // Fetch profile picture (high-res if possible)
      // Using 'profilePicture(displayImage~:playableStreams,originalImage~:playableStreams)' might give more options
      const pictureResponse = await fetch(`${LINKEDIN_API_URL}/me?projection=(id,profilePicture(displayImage~:playableStreams))`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      let profilePictureUrl = null;
      if (pictureResponse.ok) {
        const pictureData = await pictureResponse.json();
        // Iterate through elements to find the largest, or a suitable one
        const elements = pictureData.profilePicture?.['displayImage~']?.elements;
        if (elements && elements.length > 0) {
          // Prefer high-resolution, search for 'HEIGHT_400' or similar, then fallback
          let bestElement = elements.find(el => el.artifact?.endsWith('HEIGHT_400.jpeg') || el.artifact?.endsWith('HEIGHT_400.png'));
          if (!bestElement) bestElement = elements[elements.length-1]; // fallback to last one (often largest)
          profilePictureUrl = bestElement?.identifiers?.[0]?.identifier || null;
        }
      } else {
        console.warn('Failed to fetch LinkedIn profile picture:', pictureResponse.status);
      }

      // Fetch header image (cover image) - This is often a separate call or part of organization data
      // Placeholder: LinkedIn API for personal cover image is not straightforward and might require different permissions/endpoints.
      // For now, we'll set it to null. This often comes from /organizations if it's a company page.
      const headerImageUrl = null; // TODO: Investigate LinkedIn API for personal cover image

      // Fetch email address
      const emailResponse = await fetch(`${LINKEDIN_API_URL}/emailAddress?q=members&projection=(elements*(handle~))`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (!emailResponse.ok) {
        console.warn('Failed to fetch LinkedIn email:', emailResponse.status);
      }
      
      const emailData = await emailResponse.json();
      const email = emailData.elements?.[0]?.['handle~']?.emailAddress;

      // Fetch network size (connections)
      // The r_1st_connections_size scope should grant this.
      const networkResponse = await fetch(`${LINKEDIN_API_URL}/connections?q=viewer&count=1`, { // count=1 is enough to get _total
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      let connectionCount = 0;
      if (networkResponse.ok) {
        const networkData = await networkResponse.json();
        connectionCount = networkData.paging?.total || networkData._total || 0; // LinkedIn API has used both _total and paging.total
      } else {
        console.warn('Failed to fetch LinkedIn connection count:', networkResponse.status);
      }
      
      // Follower count is typically for organization pages or creators, not standard profiles.
      // Placeholder:
      const followerCount = 0; // TODO: Investigate if follower count is available for personal profiles

      // Extracting other fields (headline, bio, current_position, company)
      // These depend on the exact structure returned by /me with projections
      const headline = profileData.headline?.localized?.[Object.keys(profileData.headline.localized)[0]] || 
                       (profileData.headline && typeof profileData.headline === 'string' ? profileData.headline : null);
      
      // Bio/Summary is often in a field like 'summary' or within an 'aboutMeVersion' object
      const bio = profileData.summary || profileData.aboutMeVersion?.localizedSummary || null; // Adjust based on actual API response

      // Current position and company would ideally come from a 'positions' array/object
      // This part is highly dependent on the API version and specific projection used for positions
      let currentPosition = null;
      let company = null;
      // Example: if positions were fetched and `profileData.positions.values[0]` is the current one
      // currentPosition = profileData.positions?.values?.[0]?.title;
      // company = profileData.positions?.values?.[0]?.company?.name;
      // For now, we'll leave them as null and they can be populated if the /me projection includes them.
      // Attempt to get current position from positionsV2
      if (profileData.positionsV2?.elements && profileData.positionsV2.elements.length > 0) {
        // Find the position that doesn't have an end date, or the most recent one
        const currentPositions = profileData.positionsV2.elements.filter((p: any) => !p.endYear && !p.endMonth);
        let latestPosition = null;
        if (currentPositions.length > 0) {
          latestPosition = currentPositions.sort((a: any, b: any) => (b.startYear - a.startYear) || (b.startMonth - a.startMonth))[0];
        } else if (profileData.positionsV2.elements.length > 0) {
          // Fallback to most recent ended position if no current one is explicitly marked
          latestPosition = profileData.positionsV2.elements.sort((a: any, b: any) => 
            (b.endYear || b.startYear) - (a.endYear || a.startYear) || 
            (b.endMonth || b.startMonth) - (a.endMonth || a.startMonth)
          )[0];
        }

        if (latestPosition) {
          currentPosition = latestPosition.title || null;
          // companyName might be directly available, or nested under company.name
          company = latestPosition.companyName || latestPosition.company?.name || null;
        }
      }

      const profileUrl = profileData.vanityName ? `https://www.linkedin.com/in/${profileData.vanityName}` : null;

      return {
        linkedinId: profileData.id,
        full_name: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
        headline,
        bio,
        avatar_url: profilePictureUrl,
        header_image_url: headerImageUrl,
        company, // Will be null if not fetched/available
        current_position: currentPosition, // Will be null if not fetched/available
        email,
        profile_url: profileUrl,
        connection_count: connectionCount,
        follower_count: followerCount, // Will be 0 or null
        // Scores will be calculated later or come from a different source
      };
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      toast.error('Error fetching LinkedIn profile details.');
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
      const user = session.user; 
      if (!user) {
        toast.error('No user found in session');
        throw new Error('No user found in session');
      }

      const linkedinApiData = await linkedinAuthService.fetchLinkedInProfile(session.provider_token);

      const profileToUpsert: Database['public']['Tables']['profiles']['Insert'] = {
        id: user.id, // profiles.id is the user.id from auth.users
        full_name: linkedinApiData.full_name,
        headline: linkedinApiData.headline,
        bio: linkedinApiData.bio,
        avatar_url: linkedinApiData.avatar_url,
        header_image_url: linkedinApiData.header_image_url,
        company: linkedinApiData.company,
        current_position: linkedinApiData.current_position,
        profile_url: linkedinApiData.profile_url,
        connection_count: linkedinApiData.connection_count,
        follower_count: linkedinApiData.follower_count,
        // Scores, phone, etc., will be populated if available or by other processes
        // For example, if linkedinApiData includes these, map them here:
        // profile_strength_score: linkedinApiData.profile_strength_score,
        // network_score: linkedinApiData.network_score,
        // engagement_score: linkedinApiData.engagement_score,
        // phone: linkedinApiData.phone, // if available
        updated_at: new Date().toISOString(),
        // created_at will be set by default in DB or can be set here if needed
        // created_at: new Date().toISOString(), // Only if not defaulted in DB or for specific logic
      };
      
      await linkedinProfileService.updateProfile(profileToUpsert);

      toast.success('LinkedIn profile data fetched and saved.');
      return linkedinApiData; 
    } catch (error) {
      console.error('Error handling LinkedIn callback:', error);
      toast.error('Failed to complete LinkedIn authentication');
      throw error;
    }
  }
}; 