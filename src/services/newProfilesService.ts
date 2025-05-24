
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
      
      // Transform database record to NewProfile format
      return {
        id: data.id,
        company_name: data.company || '',
        company_location: data.company_contact || '',
        company_phone: data.phone || '',
        full_name: data.full_name,
        created_at: data.updated_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
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

      // Map NewProfile updates to database schema
      const dbUpdates: any = {};
      if (updates.company_name !== undefined) dbUpdates.company = updates.company_name;
      if (updates.company_location !== undefined) dbUpdates.company_contact = updates.company_location;
      if (updates.company_phone !== undefined) dbUpdates.phone = updates.company_phone;
      if (updates.full_name !== undefined) dbUpdates.full_name = updates.full_name;

      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      toast.success('Profile updated successfully');
      
      // Transform back to NewProfile format
      return {
        id: data.id,
        company_name: data.company || '',
        company_location: data.company_contact || '',
        company_phone: data.phone || '',
        full_name: data.full_name,
        created_at: data.updated_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
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

      // Map NewProfile data to database schema
      const dbData = {
        id: user.id,
        company: profileData.company_name,
        company_contact: profileData.company_location,
        phone: profileData.company_phone,
        full_name: profileData.full_name
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(dbData)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
      
      toast.success('Profile created successfully');
      
      // Transform back to NewProfile format
      return {
        id: data.id,
        company_name: data.company || '',
        company_location: data.company_contact || '',
        company_phone: data.phone || '',
        full_name: data.full_name,
        created_at: data.updated_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
    } catch (err: any) {
      console.error('Error creating profile:', err.message);
      toast.error('Failed to create profile: ' + err.message);
      return null;
    }
  }
};
