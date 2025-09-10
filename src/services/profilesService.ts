import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  avatar_url: string | null;
  phone: string | null;
  company_contact: string | null;
  // Onboarding fields (optional to maintain backward compatibility)
  role?: 'personal' | 'hr' | null;
  plan_tier?: 'free' | 'basic' | 'premium' | null;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  onboarding_completed?: boolean | null;
  updated_at: string | null;
};

export type ProfileUpdateInput = Omit<Profile, 'id' | 'updated_at'>;

export const profilesService = {
  // Get the current user's profile - RLS will ensure users can only access their own profile
  getProfile: async (): Promise<Profile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch profile');
        return null;
      }

      console.log('Fetching profile for user:', user.id);
      
      // RLS will ensure users can only access their own profile
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, company, avatar_url, phone, company_contact, role, plan_tier, trial_started_at, trial_ends_at, onboarding_completed, updated_at')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        // Don't throw error since the profile might not exist yet
        if ((error as any).code !== 'PGRST116') { // PGRST116 is "no rows returned" error code
          toast.error('Failed to load profile');
        }
        return null;
      }
      
      return data as Profile;
    } catch (err: any) {
      console.error('Error in getProfile:', err.message);
      toast.error('Failed to fetch profile');
      return null;
    }
  },
  
  // Create or update a user profile
  updateProfile: async (profileData: ProfileUpdateInput): Promise<Profile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to update your profile');
        return null;
      }
      
      // Set up profile data with user id
      const updatedData = {
        id: user.id, // Profile id is the user's auth id
        ...profileData,
        updated_at: new Date().toISOString()
      } as any;
      
      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      let result;
      
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update(updatedData)
          .eq('id', user.id)
          .select('id, full_name, company, avatar_url, phone, company_contact, role, plan_tier, trial_started_at, trial_ends_at, onboarding_completed, updated_at')
          .single();
      } else {
        // Insert new profile
        result = await supabase
          .from('profiles')
          .insert(updatedData)
          .select('id, full_name, company, avatar_url, phone, company_contact, role, plan_tier, trial_started_at, trial_ends_at, onboarding_completed, updated_at')
          .single();
      }
      
      if (result.error) {
        console.error('Error updating profile:', result.error);
        throw result.error;
      }
      
      // Also update user metadata to keep it in sync
      await supabase.auth.updateUser({
        data: { 
          full_name: (profileData as any).full_name,
          avatar_url: (profileData as any).avatar_url
        }
      });
      
      toast.success('Profile updated successfully');
      return result.data as Profile;
    } catch (err: any) {
      console.error('Error in updateProfile:', err.message);
      toast.error('Failed to update profile');
      return null;
    }
  },
  
  // Get profile by ID (for admin purposes or to view public profiles)
  getProfileById: async (id: string): Promise<Profile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch profile');
        return null;
      }
      
      // The RLS policy will determine if the user has access to this profile
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, company, avatar_url, phone, company_contact, role, plan_tier, trial_started_at, trial_ends_at, onboarding_completed, updated_at')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching profile by ID:', error);
        throw error;
      }
      
      return data as Profile;
    } catch (err: any) {
      console.error('Error in getProfileById:', err.message);
      toast.error('Failed to fetch profile');
      return null;
    }
  }
};
