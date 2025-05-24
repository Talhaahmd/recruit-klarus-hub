
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Candidate = {
  id: string;
  job_id?: string;
  email: string;
  phone?: string;
  resume_url?: string;
  applied_date?: string;
  status?: string;
  notes?: string;
  rating: number;
  user_id?: string;
  created_by?: string;
  created_at?: string;
  full_name?: string;
  current_job_title?: string;
  location?: string;
  linkedin?: string;
  skills?: string;
  years_experience?: string;
  experience_level?: string;
  companies?: string;
  job_titles?: string;
  degrees?: string;
  institutions?: string;
  certifications?: string;
  graduation_years?: string;
  ai_summary?: string;
  ai_content?: string;
  ai_rating?: number;
  source?: string;
  timestamp?: string;
};

export const candidatesService = {
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }

      console.log('Fetching candidates for user:', user.id);

      // With updated RLS policies, this will automatically filter to candidates for jobs owned by the user
      // or candidates without job_id (general applications)
      const { data, error } = await supabase.from('candidates').select('*');
      
      if (error) {
        console.error('Error fetching candidates:', error);
        throw error;
      }

      console.log('Fetched candidates:', data?.length || 0);
      return (data || []).map(c => ({ ...c, rating: c.ai_rating || 0 }));
    } catch (error: any) {
      console.error('Error in getCandidates:', error.message);
      toast.error('Failed to fetch candidates');
      return [];
    }
  },

  getCandidatesByJob: async (jobId: string): Promise<Candidate[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      console.log('Fetching candidates for job:', jobId);

      // With updated RLS policies, this will automatically filter to candidates for jobs owned by the user
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('job_id', jobId);
      
      if (error) {
        console.error('Error fetching candidates by job:', error);
        throw error;
      }

      console.log('Fetched candidates for job:', data?.length || 0);
      return (data || []).map(c => ({ ...c, rating: c.ai_rating || 0 }));
    } catch (err: any) {
      console.error('Error in getCandidatesByJob:', err.message);
      return [];
    }
  },

  getCandidateById: async (id: string): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      console.log('Fetching candidate by ID:', id);

      const { data, error } = await supabase.from('candidates').select('*').eq('id', id).single();
      if (error) {
        console.error('Error fetching candidate by ID:', error);
        throw error;
      }
      
      console.log('Fetched candidate:', data?.full_name);
      return { ...data, rating: data.ai_rating || 0 };
    } catch (error: any) {
      console.error('Error in getCandidateById:', error.message);
      toast.error('Failed to fetch candidate details');
      return null;
    }
  },

  createCandidate: async (candidate: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      console.log('Creating candidate:', candidate.full_name);

      const candidateData: any = {
        ...candidate,
        rating: candidate.rating || candidate.ai_rating || 0,
      };

      // With new RLS policy allowing public insertion, we don't need to set user_id for creation
      // The RLS will handle viewing permissions based on job ownership

      const { data, error } = await supabase.from('candidates').insert(candidateData).select().single();
      if (error) {
        console.error('Error creating candidate:', error);
        throw error;
      }

      console.log('Created candidate successfully:', data.id);
      toast.success(user ? 'Candidate created successfully' : 'Candidate application received');
      return { ...data, rating: data.ai_rating || 0 };
    } catch (error: any) {
      console.error('Error in createCandidate:', error.message);
      toast.error('Failed to create candidate');
      return null;
    }
  },

  updateCandidate: async (id: string, updates: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      console.log('Updating candidate:', id);

      const updateData = { ...updates, rating: updates.rating || updates.ai_rating || 0 };
      const { data, error } = await supabase.from('candidates').update(updateData).eq('id', id).select().single();
      if (error) {
        console.error('Error updating candidate:', error);
        throw error;
      }

      console.log('Updated candidate successfully');
      toast.success('Candidate updated successfully');
      return { ...data, rating: data.ai_rating || 0 };
    } catch (error: any) {
      console.error('Error in updateCandidate:', error.message);
      toast.error('Failed to update candidate');
      return null;
    }
  },

  deleteCandidate: async (id: string, jobId?: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      console.log('Deleting candidate:', id);

      const { error } = await supabase.from('candidates').delete().eq('id', id);
      if (error) {
        console.error('Error deleting candidate:', error);
        throw error;
      }

      if (jobId) {
        const { error: jobError } = await supabase.rpc('decrement_job_applicants', { job_id: jobId });
        if (jobError) console.error('Error decrementing job applicants:', jobError);
      }

      console.log('Deleted candidate successfully');
      toast.success('Candidate deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error in deleteCandidate:', error.message);
      toast.error('Failed to delete candidate');
      return false;
    }
  }
};
