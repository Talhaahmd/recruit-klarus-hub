
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Candidate = {
  id: string;
  job_id?: string;
  name?: string;
  full_name?: string;  
  email: string;
  phone?: string;
  resume_url?: string;
  applied_date?: string;
  status?: string;
  notes?: string;
  rating: number;
  user_id?: string;
  created_by?: string;
  
  // Additional fields needed by UI components
  location?: string;
  linkedin?: string;
  current_job_title?: string;
  years_experience?: string;
  experience_level?: string;
  skills?: string;
  companies?: string;
  job_titles?: string;
  degrees?: string;
  institutions?: string;
  graduation_years?: string;
  certifications?: string;
  ai_summary?: string;
  ai_content?: string;
  ai_rating?: number;
  timestamp?: string;
  source?: string;
  suitable_role?: string;
};

export type CandidateInput = Omit<Candidate, 'id'>;

export const candidatesService = {
  // Get all candidates - RLS will filter to only show the user's candidates
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch candidates');
        return [];
      }

      console.log('Fetching candidates for user:', user.id); // Debug log
      
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('applied_date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data as Candidate[] || [];
    } catch (err: any) {
      console.error('Error fetching candidates:', err.message);
      toast.error('Failed to load candidates');
      return [];
    }
  },
  
  // Get candidates for a specific job - RLS will ensure only your jobs' candidates are shown
  getCandidatesByJobId: async (jobId: string): Promise<Candidate[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch candidates');
        return [];
      }

      console.log('Fetching candidates for job:', jobId, 'user:', user.id); // Debug log
      
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('job_id', jobId)
        .order('applied_date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data as Candidate[] || [];
    } catch (err: any) {
      console.error('Error fetching candidates for job:', err.message);
      toast.error('Failed to load candidates for this job');
      return [];
    }
  },
  
  // Get a candidate by ID - RLS will ensure you can only access your candidates
  getCandidateById: async (id: string): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch candidate');
        return null;
      }

      console.log('Fetching candidate:', id, 'for user:', user.id); // Debug log
      
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data as Candidate;
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
        user_id: user.id,
        created_by: user.id
      };
      
      console.log('Creating candidate with user ID:', user.id); // Debug log
      
      const { data, error } = await supabase
        .from('candidates')
        .insert(candidateData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Update the job's applicant count if job_id is provided
      if (candidate.job_id) {
        await supabase.rpc('increment_job_applicants', { job_id: candidate.job_id });
      }
      
      toast.success('Candidate added successfully');
      return data as Candidate;
    } catch (err: any) {
      console.error('Error creating candidate:', err.message);
      toast.error('Failed to add candidate');
      return null;
    }
  },
  
  // Update a candidate - RLS will ensure you can only update your candidates
  updateCandidate: async (id: string, updates: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot update candidate');
        return null;
      }

      console.log('Updating candidate:', id, 'for user:', user.id); // Debug log
      
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
      return data as Candidate;
    } catch (err: any) {
      console.error('Error updating candidate:', err.message);
      toast.error('Failed to update candidate');
      return null;
    }
  },
  
  // Delete a candidate - also needs to update the job's applicant count
  deleteCandidate: async (id: string, jobId?: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot delete candidate');
        return false;
      }

      console.log('Deleting candidate:', id, 'for user:', user.id); // Debug log
      
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update the job's applicant count if jobId is provided
      if (jobId) {
        await supabase.rpc('decrement_job_applicants', { job_id: jobId });
      }
      
      toast.success('Candidate deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting candidate:', err.message);
      toast.error('Failed to delete candidate');
      return false;
    }
  }
};
