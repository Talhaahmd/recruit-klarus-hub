
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Candidate = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone: string;
  resume_url?: string;
  applied_date: string;
  status: string;
  notes?: string;
  rating: number;
};

export type CandidateInput = Omit<Candidate, 'id'>;

export const candidatesService = {
  // Get all candidates for the current user
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
  
  // Get a candidate by ID
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
  
  // Get candidates by job ID
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
      toast.error('Failed to load candidates');
      return [];
    }
  },
  
  // Create a new candidate
  createCandidate: async (candidate: CandidateInput): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add a candidate');
        return null;
      }
      
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
      
      // Increment the job's applicant count
      await supabase.rpc('increment_job_applicants', { job_id: candidate.job_id });
      
      toast.success('Candidate added successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating candidate:', err.message);
      toast.error('Failed to add candidate');
      return null;
    }
  },
  
  // Update a candidate
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
  
  // Delete a candidate
  deleteCandidate: async (id: string, jobId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Decrement the job's applicant count
      await supabase.rpc('decrement_job_applicants', { job_id: jobId });
      
      toast.success('Candidate deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting candidate:', err.message);
      toast.error('Failed to delete candidate');
      return false;
    }
  },
  
  // Upload resume and return URL
  uploadResume: async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading resume:', err.message);
      toast.error('Failed to upload resume');
      return null;
    }
  }
};
