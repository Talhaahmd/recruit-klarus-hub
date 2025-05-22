
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Candidate = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  applied_date: string;
  status: string;
  notes: string;
  rating: number;
  user_id?: string;
};

export type CandidateInput = Omit<Candidate, 'id'>;

export const candidatesService = {
  // Get all candidates - RLS will filter to only show the user's candidates
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('applied_date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching candidates:', err.message);
      toast.error('Failed to load candidates');
      return [];
    }
  },
  
  // Get candidates for a specific job - RLS will ensure only your jobs' candidates are shown
  getCandidatesByJobId: async (jobId: string): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('job_id', jobId)
        .order('applied_date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching candidates for job:', err.message);
      toast.error('Failed to load candidates for this job');
      return [];
    }
  },
  
  // Get a candidate by ID - RLS will ensure you can only access your candidates
  getCandidateById: async (id: string): Promise<Candidate | null> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching candidate:', err.message);
      toast.error('Failed to load candidate');
      return null;
    }
  },
  
  // Create a new candidate - also needs to update the job's applicant count
  createCandidate: async (candidate: CandidateInput): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add a candidate');
        return null;
      }
      
      // Ensure user_id is set correctly
      const candidateData = {
        ...candidate,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('candidates')
        .insert(candidateData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Update the job's applicant count
      await supabase.rpc('increment_job_applicants', { job_id: candidate.job_id });
      
      toast.success('Candidate added successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating candidate:', err.message);
      toast.error('Failed to add candidate');
      return null;
    }
  },
  
  // Update a candidate - RLS will ensure you can only update your candidates
  updateCandidate: async (id: string, updates: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast.success('Candidate updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating candidate:', err.message);
      toast.error('Failed to update candidate');
      return null;
    }
  },
  
  // Delete a candidate - also needs to update the job's applicant count
  deleteCandidate: async (id: string, jobId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update the job's applicant count
      await supabase.rpc('decrement_job_applicants', { job_id: jobId });
      
      toast.success('Candidate deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting candidate:', err.message);
      toast.error('Failed to delete candidate');
      return false;
    }
  }
};
