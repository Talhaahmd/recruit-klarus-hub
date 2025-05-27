import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

export const linkedinEnhancedService = {
  // Get organization data using r_organization_admin scope
  getOrganizationData: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.provider_token) {
        toast.error('LinkedIn authentication required');
        return null;
      }

      const response = await fetch(`${LINKEDIN_API_URL}/organizationAcls?q=roleAssignee&role=ADMINISTRATOR`, {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch organization data');
      }

      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error('Error fetching organization data:', error);
      toast.error('Failed to fetch organization data');
      return null;
    }
  },

  // Get organization analytics using r_organization_admin scope
  getOrganizationAnalytics: async (organizationId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.provider_token) {
        toast.error('LinkedIn authentication required');
        return null;
      }

      const response = await fetch(`${LINKEDIN_API_URL}/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:${organizationId}`, {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch organization analytics');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching organization analytics:', error);
      toast.error('Failed to fetch organization analytics');
      return null;
    }
  },

  // Get user's network size using r_1st_connections_size scope
  getNetworkSize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.provider_token) {
        toast.error('LinkedIn authentication required');
        return null;
      }

      const response = await fetch(`${LINKEDIN_API_URL}/connections?q=viewer&start=0&count=0`, {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch network size');
      }

      const data = await response.json();
      return data._total;
    } catch (error) {
      console.error('Error fetching network size:', error);
      toast.error('Failed to fetch network size');
      return null;
    }
  },

  // Get advertising accounts using r_ads scope
  getAdvertisingAccounts: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.provider_token) {
        toast.error('LinkedIn authentication required');
        return null;
      }

      const response = await fetch(`${LINKEDIN_API_URL}/adAccounts?q=search&search.status.values[0]=ACTIVE`, {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch advertising accounts');
      }

      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error('Error fetching advertising accounts:', error);
      toast.error('Failed to fetch advertising accounts');
      return null;
    }
  },

  // Get advertising account analytics using r_ads_reporting scope
  getAdvertisingAnalytics: async (accountId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.provider_token) {
        toast.error('LinkedIn authentication required');
        return null;
      }

      const response = await fetch(`${LINKEDIN_API_URL}/adAnalytics?q=accounts&accounts[0]=${accountId}`, {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch advertising analytics');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching advertising analytics:', error);
      toast.error('Failed to fetch advertising analytics');
      return null;
    }
  },

  // Create organization post using w_organization_social scope
  createOrganizationPost: async (organizationId: string, content: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.provider_token) {
        toast.error('LinkedIn authentication required');
        return null;
      }

      const response = await fetch(`${LINKEDIN_API_URL}/shares`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: `urn:li:organization:${organizationId}`,
          text: {
            text: content
          },
          distribution: {
            feedDistribution: 'MAIN_FEED',
            targetEntities: [],
            thirdPartyDistributionChannels: []
          },
          subject: 'Organization Post',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareMediaCategory: 'NONE',
              shareCommentary: {
                text: content
              },
              media: []
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create organization post');
      }

      const data = await response.json();
      toast.success('Organization post created successfully');
      return data;
    } catch (error) {
      console.error('Error creating organization post:', error);
      toast.error('Failed to create organization post');
      return null;
    }
  }
}; 