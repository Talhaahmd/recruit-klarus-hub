
import { supabase, CandidateRow } from '@/lib/supabase';
import { toast } from "sonner";

// Type definition for frontend usage
export type Candidate = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  appliedDate: string;
  status: string;
  notes: string;
  rating: number;
};

// Convert database row to frontend format
const toCandidate = (row: CandidateRow): Candidate => ({
  id: row.id,
  jobId: row.job_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  resumeUrl: row.resume_url,
  appliedDate: row.applied_date,
  status: row.status,
  notes: row.notes,
  rating: row.rating,
});

// Convert frontend data to database format
const toCandidateRow = (candidate: Omit<Candidate, 'id'>, userId: string): Omit<CandidateRow, 'id' | 'created_at'> => ({
  job_id: candidate.jobId,
  name: candidate.name,
  email: candidate.email,
  phone: candidate.phone,
  resume_url: candidate.resumeUrl,
  applied_date: candidate.appliedDate || new Date().toISOString().split('T')[0],
  status: candidate.status || 'New',
  notes: candidate.notes || '',
  rating: candidate.rating || 3,
  user_id: userId,
});

export const candidatesService = {
  // Get all candidates for the current user
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching candidates:', error);
        toast.error('Failed to load candidates');
        return [];
      }
      
      return data.map(toCandidate);
    } catch (err) {
      console.error('Unexpected error fetching candidates:', err);
      toast.error('Failed to load candidates');
      return [];
    }
  },
  
  // Get candidates for a specific job
  getCandidatesForJob: async (jobId: string): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching candidates for job:', error);
        toast.error('Failed to load candidates');
        return [];
      }
      
      return data.map(toCandidate);
    } catch (err) {
      console.error('Unexpected error fetching candidates for job:', err);
      toast.error('Failed to load candidates');
      return [];
    }
  },
  
  // Get a specific candidate by ID
  getCandidate: async (id: string): Promise<Candidate | null> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching candidate:', error);
        toast.error('Failed to load candidate details');
        return null;
      }
      
      return toCandidate(data);
    } catch (err) {
      console.error('Unexpected error fetching candidate:', err);
      toast.error('Failed to load candidate details');
      return null;
    }
  },
  
  // Create a new candidate
  createCandidate: async (candidate: Omit<Candidate, 'id'>): Promise<Candidate | null> => {
    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You must be logged in to add a candidate');
        return null;
      }
      
      const candidateData = toCandidateRow(candidate, userData.user.id);
      
      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateData])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating candidate:', error);
        toast.error('Failed to add candidate');
        return null;
      }
      
      // Update job applicant count
      await supabase.rpc('increment_job_applicants', { job_id: candidate.jobId });
      
      toast.success('Candidate added successfully');
      return toCandidate(data);
    } catch (err) {
      console.error('Unexpected error creating candidate:', err);
      toast.error('Failed to add candidate');
      return null;
    }
  },
  
  // Update an existing candidate
  updateCandidate: async (id: string, candidate: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      const updates: Partial<CandidateRow> = {};
      
      if (candidate.name) updates.name = candidate.name;
      if (candidate.email) updates.email = candidate.email;
      if (candidate.phone) updates.phone = candidate.phone;
      if (candidate.status) updates.status = candidate.status;
      if (candidate.notes) updates.notes = candidate.notes;
      if (candidate.rating !== undefined) updates.rating = candidate.rating;
      if (candidate.resumeUrl) updates.resume_url = candidate.resumeUrl;
      
      const { data, error } = await supabase
        .from('candidates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating candidate:', error);
        toast.error('Failed to update candidate');
        return null;
      }
      
      toast.success('Candidate updated successfully');
      return toCandidate(data);
    } catch (err) {
      console.error('Unexpected error updating candidate:', err);
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
        console.error('Error deleting candidate:', error);
        toast.error('Failed to delete candidate');
        return false;
      }
      
      // Decrement job applicant count
      await supabase.rpc('decrement_job_applicants', { job_id: jobId });
      
      toast.success('Candidate deleted successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error deleting candidate:', err);
      toast.error('Failed to delete candidate');
      return false;
    }
  },
  
  // Upload resume for a candidate
  uploadResume: async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `resumes/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Error uploading resume:', uploadError);
        toast.error('Failed to upload resume');
        return null;
      }
      
      // Get public URL for the file
      const { data } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (err) {
      console.error('Unexpected error uploading resume:', err);
      toast.error('Failed to upload resume');
      return null;
    }
  },
};
