import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Database } from '@/types/supabase';

export type LinkedInProfile = Database['public']['Tables']['linkedin_profiles']['Row'];
type ProfileInput = Omit<LinkedInProfile, 'id' | 'created_at' | 'last_updated'>;

export const linkedinProfileService = {
  // Get LinkedIn profile for the current user
  getProfile: async (): Promise<LinkedInProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to view profile');
        return null;
      }

      const { data, error } = await supabase
        .from('linkedin_profiles')
        .select()
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching LinkedIn profile:', error);
        toast.error('Failed to load LinkedIn profile');
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error fetching LinkedIn profile:', err);
      toast.error('Failed to load LinkedIn profile');
      return null;
    }
  },

  // Update LinkedIn profile
  updateProfile: async (profile: Partial<ProfileInput>): Promise<LinkedInProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to update profile');
        return null;
      }

      const { data, error } = await supabase
        .from('linkedin_profiles')
        .upsert({
          ...profile,
          user_id: user.id,
          last_updated: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating LinkedIn profile:', error);
        toast.error('Failed to update LinkedIn profile');
        return null;
      }

      toast.success('LinkedIn profile updated successfully');
      return data;
    } catch (err) {
      console.error('Unexpected error updating LinkedIn profile:', err);
      toast.error('Failed to update LinkedIn profile');
      return null;
    }
  },

  // Analyze LinkedIn profile
  analyzeProfile: async (): Promise<{
    summary: string;
    insights: {
      profileStrength: string;
      careerTrajectory: string;
      networkAnalysis: string;
      skillsAssessment: string;
      industryPosition: string;
    };
    suggestions: {
      profile: string[];
      content: string[];
      networking: string[];
      skills: string[];
    };
    scores: {
      engagement: number;
      profile_strength: number;
      network: number;
    };
  } | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to analyze profile');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('analyze-linkedin-profile');

      if (error) {
        console.error('Error analyzing LinkedIn profile:', error);
        toast.error('Failed to analyze LinkedIn profile');
        return null;
      }

      toast.success('LinkedIn profile analyzed successfully');
      return data;
    } catch (err) {
      console.error('Unexpected error analyzing LinkedIn profile:', err);
      toast.error('Failed to analyze LinkedIn profile');
      return null;
    }
  }
}; 