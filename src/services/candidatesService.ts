
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Candidate = {
  id: string;
  job_id?: string;
  name: string;
  email: string;
  phone: string;
  resume_url?: string;
  applied_date: string;
  status: string;
  notes?: string;
  rating: number;
  location?: string;
  skills?: string;
  ai_summary?: string;
  ai_content?: string;
  current_job_title?: string;
  experience_level?: string;
  linkedin?: string;
};

export type CandidateInput = Omit<Candidate, 'id'>;

export const candidatesService = {
  // Get all candidates
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Map the database schema to our frontend Candidate type
      const candidates = data.map(c => ({
        id: c.id,
        job_id: c.job_id || '',
        name: c.full_name || '',
        email: c.email || '',
        phone: c.phone || '',
        resume_url: c.resume_url || '',
        applied_date: c.timestamp ? new Date(c.timestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: c.status || 'Screening',
        notes: c.ai_summary || '',
        rating: c.ai_rating || 0,
        location: c.location || '',
        skills: c.skills || '',
        ai_summary: c.ai_summary || '',
        ai_content: c.ai_content || '',
        current_job_title: c.current_job_title || '',
        experience_level: c.experience_level || '',
        linkedin: c.linkedin || ''
      }));
      
      return candidates;
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
        .maybeSingle();
        
      if (error) {
        throw error;
      }
      
      if (!data) return null;
      
      // Map to our Candidate type
      const candidate: Candidate = {
        id: data.id,
        job_id: data.job_id || '',
        name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        resume_url: data.resume_url || '',
        applied_date: data.timestamp ? new Date(data.timestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: data.status || 'Screening',
        notes: data.ai_summary || '',
        rating: data.ai_rating || 0,
        location: data.location || '',
        skills: data.skills || '',
        ai_summary: data.ai_summary || '',
        ai_content: data.ai_content || '',
        current_job_title: data.current_job_title || '',
        experience_level: data.experience_level || '',
        linkedin: data.linkedin || ''
      };
      
      return candidate;
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
        .order('timestamp', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Map the database schema to our frontend Candidate type
      const candidates = data.map(c => ({
        id: c.id,
        job_id: c.job_id || '',
        name: c.full_name || '',
        email: c.email || '',
        phone: c.phone || '',
        resume_url: c.resume_url || '',
        applied_date: c.timestamp ? new Date(c.timestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: c.status || 'Screening',
        notes: c.ai_summary || '',
        rating: c.ai_rating || 0,
        location: c.location || '',
        skills: c.skills || '',
        ai_summary: c.ai_summary || '',
        ai_content: c.ai_content || '',
        current_job_title: c.current_job_title || '',
        experience_level: c.experience_level || '',
        linkedin: c.linkedin || ''
      }));
      
      return candidates;
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
        user_id: user.id,
        job_id: candidate.job_id || null,
        full_name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        resume_url: candidate.resume_url || null,
        timestamp: new Date().toISOString(),
        status: candidate.status || 'Screening',
        ai_summary: candidate.notes || null,
        ai_rating: candidate.rating || 0,
        location: candidate.location || null,
        skills: candidate.skills || null,
        current_job_title: candidate.current_job_title || null,
        experience_level: candidate.experience_level || null,
        linkedin: candidate.linkedin || null
      };
      
      const { data, error } = await supabase
        .from('candidates')
        .insert(candidateData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Increment the job's applicant count if there's a job_id
      if (candidate.job_id) {
        await supabase.rpc('increment_job_applicants', { job_id: candidate.job_id });
      }
      
      toast.success('Candidate added successfully');
      
      // Map returned data to our Candidate type
      const newCandidate: Candidate = {
        id: data.id,
        job_id: data.job_id || '',
        name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        resume_url: data.resume_url || '',
        applied_date: data.timestamp ? new Date(data.timestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: data.status || 'Screening',
        notes: data.ai_summary || '',
        rating: data.ai_rating || 0,
        location: data.location || '',
        skills: data.skills || '',
        ai_summary: data.ai_summary || '',
        ai_content: data.ai_content || '',
        current_job_title: data.current_job_title || '',
        experience_level: data.experience_level || '',
        linkedin: data.linkedin || ''
      };
      
      return newCandidate;
    } catch (err: any) {
      console.error('Error creating candidate:', err.message);
      toast.error('Failed to add candidate');
      return null;
    }
  },
  
  // Update a candidate
  updateCandidate: async (id: string, updates: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      // Map our frontend type to the database schema
      const updateData: any = {};
      
      if (updates.name) updateData.full_name = updates.name;
      if (updates.email) updateData.email = updates.email;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.resume_url) updateData.resume_url = updates.resume_url;
      if (updates.status) updateData.status = updates.status;
      if (updates.notes) updateData.ai_summary = updates.notes;
      if (updates.rating !== undefined) updateData.ai_rating = updates.rating;
      if (updates.location) updateData.location = updates.location;
      if (updates.skills) updateData.skills = updates.skills;
      if (updates.ai_summary) updateData.ai_summary = updates.ai_summary;
      if (updates.ai_content) updateData.ai_content = updates.ai_content;
      if (updates.current_job_title) updateData.current_job_title = updates.current_job_title;
      if (updates.experience_level) updateData.experience_level = updates.experience_level;
      if (updates.linkedin) updateData.linkedin = updates.linkedin;
      
      const { data, error } = await supabase
        .from('candidates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast.success('Candidate updated successfully');
      
      // Map to our Candidate type
      const updatedCandidate: Candidate = {
        id: data.id,
        job_id: data.job_id || '',
        name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        resume_url: data.resume_url || '',
        applied_date: data.timestamp ? new Date(data.timestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: data.status || 'Screening',
        notes: data.ai_summary || '',
        rating: data.ai_rating || 0,
        location: data.location || '',
        skills: data.skills || '',
        ai_summary: data.ai_summary || '',
        ai_content: data.ai_content || '',
        current_job_title: data.current_job_title || '',
        experience_level: data.experience_level || '',
        linkedin: data.linkedin || ''
      };
      
      return updatedCandidate;
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
