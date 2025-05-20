
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Candidate = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string | null;
  appliedDate: string;
  status: string;
  notes: string | null;
  rating: number;
};

type CandidateInput = Omit<Candidate, 'id'>;

export const candidatesService = {
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('applied_date', { ascending: false });

      if (error) {
        console.error('Error fetching candidates:', error);
        toast.error('Failed to load candidates');
        return [];
      }

      return data.map(candidate => ({
        id: candidate.id,
        jobId: candidate.job_id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        resumeUrl: candidate.resume_url,
        appliedDate: candidate.applied_date,
        status: candidate.status,
        notes: candidate.notes,
        rating: candidate.rating
      }));
    } catch (err) {
      console.error('Unexpected error fetching candidates:', err);
      toast.error('Failed to load candidates');
      return [];
    }
  },

  getCandidatesByJobId: async (jobId: string): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('job_id', jobId)
        .order('applied_date', { ascending: false });

      if (error) {
        console.error('Error fetching candidates by job id:', error);
        toast.error('Failed to load candidates for this job');
        return [];
      }

      return data.map(candidate => ({
        id: candidate.id,
        jobId: candidate.job_id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        resumeUrl: candidate.resume_url,
        appliedDate: candidate.applied_date,
        status: candidate.status,
        notes: candidate.notes,
        rating: candidate.rating
      }));
    } catch (err) {
      console.error('Unexpected error fetching candidates by job id:', err);
      toast.error('Failed to load candidates for this job');
      return [];
    }
  },

  getCandidateById: async (id: string): Promise<Candidate | null> => {
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

      return {
        id: data.id,
        jobId: data.job_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        resumeUrl: data.resume_url,
        appliedDate: data.applied_date,
        status: data.status,
        notes: data.notes,
        rating: data.rating
      };
    } catch (err) {
      console.error('Unexpected error fetching candidate by id:', err);
      toast.error('Failed to load candidate details');
      return null;
    }
  },

  createCandidate: async (candidate: CandidateInput): Promise<Candidate | null> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert([{
          job_id: candidate.jobId,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          resume_url: candidate.resumeUrl,
          applied_date: candidate.appliedDate,
          status: candidate.status,
          notes: candidate.notes,
          rating: candidate.rating
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating candidate:', error);
        toast.error('Failed to create candidate');
        return null;
      }

      // Call the function to increment job applicants
      await supabase.rpc('increment_job_applicants', { job_id: candidate.jobId });

      toast.success('Candidate created successfully');
      return {
        id: data.id,
        jobId: data.job_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        resumeUrl: data.resume_url,
        appliedDate: data.applied_date,
        status: data.status,
        notes: data.notes,
        rating: data.rating
      };
    } catch (err) {
      console.error('Unexpected error creating candidate:', err);
      toast.error('Failed to create candidate');
      return null;
    }
  },

  updateCandidate: async (id: string, candidate: Partial<CandidateInput>): Promise<boolean> => {
    try {
      // Convert from frontend to database field names
      const dbCandidate: any = {};
      if (candidate.jobId !== undefined) dbCandidate.job_id = candidate.jobId;
      if (candidate.name !== undefined) dbCandidate.name = candidate.name;
      if (candidate.email !== undefined) dbCandidate.email = candidate.email;
      if (candidate.phone !== undefined) dbCandidate.phone = candidate.phone;
      if (candidate.resumeUrl !== undefined) dbCandidate.resume_url = candidate.resumeUrl;
      if (candidate.appliedDate !== undefined) dbCandidate.applied_date = candidate.appliedDate;
      if (candidate.status !== undefined) dbCandidate.status = candidate.status;
      if (candidate.notes !== undefined) dbCandidate.notes = candidate.notes;
      if (candidate.rating !== undefined) dbCandidate.rating = candidate.rating;

      const { error } = await supabase
        .from('candidates')
        .update(dbCandidate)
        .eq('id', id);

      if (error) {
        console.error('Error updating candidate:', error);
        toast.error('Failed to update candidate');
        return false;
      }

      toast.success('Candidate updated successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error updating candidate:', err);
      toast.error('Failed to update candidate');
      return false;
    }
  },

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

      // Call the function to decrement job applicants
      await supabase.rpc('decrement_job_applicants', { job_id: jobId });

      toast.success('Candidate deleted successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error deleting candidate:', err);
      toast.error('Failed to delete candidate');
      return false;
    }
  },

  uploadResume: async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading resume:', uploadError);
        toast.error('Failed to upload resume');
        return null;
      }

      const { data } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Unexpected error uploading resume:', err);
      toast.error('Failed to upload resume');
      return null;
    }
  }
};
