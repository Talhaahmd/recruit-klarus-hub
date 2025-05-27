import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Database } from '@/types/supabase';

export type LinkedInProfile = Database['public']['Tables']['profiles']['Row'];
// ProfileInput is based on Insert type, which now requires 'id' (user.id)
// and omits auto-generated fields like created_at, updated_at if they are handled by DB default or server-side logic before insert.
// However, updateProfile typically receives these from the caller (e.g., linkedinAuthService)
// So, making it Partial<Database['public']['Tables']['profiles']['Insert']> is more flexible.

export const linkedinProfileService = {
  // Get LinkedIn profile for the current user
  getProfile: async (): Promise<LinkedInProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('getProfile: No user session found.');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*') 
        .eq('id', user.id) // Query by profiles.id which is auth.user.id
        .maybeSingle();

      if (error) {
        console.error('Error fetching LinkedIn profile:', error.message);
        toast.error(`Failed to load profile: ${error.message}`);
        return null;
      }
      return data;
    } catch (err: any) {
      console.error('Unexpected error fetching LinkedIn profile:', err.message);
      toast.error('An unexpected error occurred while loading your profile.');
      return null;
    }
  },

  // Update or Insert LinkedIn profile
  // The input type should match what linkedinAuthService.handleCallback provides
  updateProfile: async (profileData: Partial<Database['public']['Tables']['profiles']['Insert']>) : Promise<LinkedInProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to update your profile');
        return null;
      }

      // The profileData should already contain 'id: user.id' from the caller (e.g., linkedinAuthService or createTestProfile)
      // We ensure updated_at is set.
      const dataToUpsert = {
        ...profileData,
        id: user.id, // Explicitly ensure id is the current user's id for the upsert operation.
        updated_at: new Date().toISOString(),
      };

      // Upsert based on 'id' column, which is the user's auth ID and PK of profiles table.
      const { data, error } = await supabase
        .from('profiles')
        .upsert(dataToUpsert, { 
          onConflict: 'id', // Conflict on the primary key 'id' (user.id)
        })
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error updating LinkedIn profile:', error.message);
        // Check for specific errors, e.g., RLS violation or constraint violation
        if (error.message.includes('violates row-level security policy')) {
          toast.error('Update failed: You do not have permission to modify this profile.');
        } else if (error.message.includes('constraint')) {
          toast.error('Update failed: Profile data violates a database constraint.');
        } else {
          toast.error(`Failed to update profile: ${error.message}`);
        }
        return null;
      }

      toast.success('Profile updated successfully');
      return data;
    } catch (err: any) {
      console.error('Unexpected error updating LinkedIn profile:', err.message);
      toast.error('An unexpected error occurred while updating your profile.');
      return null;
    }
  },

  // Analyze LinkedIn profile (functionality remains the same, ensure RLS in function uses created_by)
  analyzeProfile: async (): Promise<Database['public']['Tables']['profiles']['Row']['ai_insights'] | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to analyze profile');
        return null;
      }
      // The Supabase function name is now 'process-linkedin-profile'
      const { data, error } = await supabase.functions.invoke('process-linkedin-profile');

      if (error) {
        console.error('Error analyzing LinkedIn profile:', error);
        toast.error(`Failed to analyze profile: ${error.message}`);
        return null;
      }

      toast.success('Profile analysis complete.');
      return data; 
    } catch (err: any) {
      console.error('Unexpected error analyzing LinkedIn profile:', err.message);
      toast.error('An unexpected error occurred during profile analysis.');
      return null;
    }
  }
}; 