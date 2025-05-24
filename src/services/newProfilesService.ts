
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type NewProfile = {
  id: string;
  company_name: string;
  company_location: string;
  company_phone: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
};

export const newProfilesService = {
  getProfile: async (): Promise<NewProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch profile');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching profile:', err.message);
      toast.error('Failed to load profile: ' + err.message);
      return null;
    }
  },

  updateProfile: async (updates: Partial<Omit<NewProfile, 'id' | 'created_at' | 'updated_at'>>): Promise<NewProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to update profile');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      toast.success('Profile updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating profile:', err.message);
      toast.error('Failed to update profile: ' + err.message);
      return null;
    }
  },

  createProfile: async (profileData: Omit<NewProfile, 'id' | 'created_at' | 'updated_at'>): Promise<NewProfile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a profile');
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...profileData,
          id: user.id
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
      
      toast.success('Profile created successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating profile:', err.message);
      toast.error('Failed to create profile: ' + err.message);
      return null;
    }
  }
};
