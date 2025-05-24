
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type NewCandidate = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  linkedin_link?: string;
  education?: string;
  institute?: string;
  current_job?: string;
  years_experience?: number;
  skills?: string[];
  certification?: string;
  companies?: string;
  current_job_title?: string;
  graduation_years?: string;
  experience_level?: string;
  ai_rating?: number;
  ai_summary?: string;
  ai_content?: string;
  job_id?: string;
  hr_user_id: string;
  created_at: string;
  updated_at: string;
};

export const newCandidatesService = {
  getCandidates: async (): Promise<NewCandidate[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch candidates');
        return [];
      }

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching candidates:', error);
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching candidates:', err.message);
      toast.error('Failed to load candidates: ' + err.message);
      return [];
    }
  },

  getCandidateById: async (id: string): Promise<NewCandidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to view candidate details');
        return null;
      }

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching candidate:', error);
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching candidate:', err.message);
      toast.error('Failed to load candidate details');
      return null;
    }
  },

  updateCandidate: async (id: string, updates: Partial<NewCandidate>): Promise<NewCandidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to update candidates');
        return null;
      }

      const { data, error } = await supabase
        .from('candidates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating candidate:', error);
        throw error;
      }
      
      toast.success('Candidate updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating candidate:', err.message);
      toast.error('Failed to update candidate: ' + err.message);
      return null;
    }
  },

  deleteCandidate: async (id: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to delete candidates');
        return false;
      }

      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting candidate:', error);
        throw error;
      }
      
      toast.success('Candidate deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting candidate:', err.message);
      toast.error('Failed to delete candidate: ' + err.message);
      return false;
    }
  }
};
