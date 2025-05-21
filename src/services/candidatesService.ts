
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Candidate = {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  resume_url?: string;
  applied_date?: string;
  status?: string;
  notes?: string;
  rating: number;
  user_id?: string;
  job_id?: string;
  ai_rating?: number;
  ai_summary?: string;
  ai_content?: string;
  current_job_title?: string;
  location?: string;
  years_experience?: string;
  skills?: string;
  certifications?: string;
  companies?: string;
  graduation_years?: string;
  institutions?: string;
  job_titles?: string;
  full_name?: string;
  linkedin?: string;
  degrees?: string;
  source?: string;
  experience_level?: string;
  suitable_role?: string;
};

export type CandidateInput = Omit<Candidate, 'id'>;

export const candidateStatusOptions = [
  'New',
  'Screening',
  'Interview',
  'Assessment',
  'Offer',
  'Hired',
  'Rejected',
];

export const candidatesService = {
  // Get all candidates
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Map the response to match our Candidate type
      const candidates: Candidate[] = data.map(item => ({
        id: item.id,
        name: item.full_name,
        email: item.email,
        phone: item.phone,
        resume_url: item.resume_url || undefined,
        applied_date: item.timestamp,
        status: item.status || undefined,
        notes: item.notes || undefined,
        rating: item.ai_rating || 0,
        user_id: item.user_id || undefined,
        job_id: item.job_id || undefined,
        ai_rating: item.ai_rating,
        ai_summary: item.ai_summary,
        ai_content: item.ai_content,
        current_job_title: item.current_job_title,
        location: item.location,
        years_experience: item.years_experience,
        skills: item.skills,
        certifications: item.certifications,
        companies: item.companies,
        graduation_years: item.graduation_years,
        institutions: item.institutions,
        job_titles: item.job_titles,
        full_name: item.full_name,
        linkedin: item.linkedin,
        degrees: item.degrees,
        source: item.source,
        experience_level: item.experience_level,
        suitable_role: item.suitable_role
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
        .single();
        
      if (error) {
        throw error;
      }
      
      // Map the response to match our Candidate type
      if (data) {
        const candidate: Candidate = {
          id: data.id,
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          resume_url: data.resume_url || undefined,
          applied_date: data.timestamp,
          status: data.status || undefined,
          notes: data.notes || undefined,
          rating: data.ai_rating || 0,
          user_id: data.user_id || undefined,
          job_id: data.job_id || undefined,
          ai_rating: data.ai_rating,
          ai_summary: data.ai_summary,
          ai_content: data.ai_content,
          current_job_title: data.current_job_title,
          location: data.location,
          years_experience: data.years_experience,
          skills: data.skills,
          certifications: data.certifications,
          companies: data.companies,
          graduation_years: data.graduation_years,
          institutions: data.institutions,
          job_titles: data.job_titles,
          full_name: data.full_name,
          linkedin: data.linkedin,
          degrees: data.degrees,
          source: data.source,
          experience_level: data.experience_level,
          suitable_role: data.suitable_role
        };
        
        return candidate;
      }
      
      return null;
    } catch (err: any) {
      console.error('Error fetching candidate:', err.message);
      toast.error('Failed to load candidate');
      return null;
    }
  },
  
  // Create a new candidate
  createCandidate: async (candidate: CandidateInput): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create a candidate');
        return null;
      }
      
      // Map the candidate data to match the candidates table schema
      const candidateData = {
        full_name: candidate.name || candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        resume_url: candidate.resume_url,
        timestamp: new Date().toISOString(),
        status: candidate.status || 'New',
        notes: candidate.notes,
        ai_rating: candidate.rating || candidate.ai_rating || 0,
        user_id: user.id,
        job_id: candidate.job_id,
        ai_summary: candidate.ai_summary,
        ai_content: candidate.ai_content,
        current_job_title: candidate.current_job_title,
        location: candidate.location,
        years_experience: candidate.years_experience,
        skills: candidate.skills,
        certifications: candidate.certifications,
        companies: candidate.companies,
        graduation_years: candidate.graduation_years,
        institutions: candidate.institutions,
        job_titles: candidate.job_titles,
        linkedin: candidate.linkedin,
        degrees: candidate.degrees,
        source: candidate.source || 'Manual Entry',
        experience_level: candidate.experience_level,
        suitable_role: candidate.suitable_role
      };
      
      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateData])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // If a job ID was provided, increment the applicants count for that job
      if (candidate.job_id) {
        await supabase.rpc('increment_job_applicants', { job_id: candidate.job_id });
      }
      
      toast.success('Candidate created successfully');
      
      // Map the response to match our Candidate type
      if (data) {
        const newCandidate: Candidate = {
          id: data.id,
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          resume_url: data.resume_url || undefined,
          applied_date: data.timestamp,
          status: data.status || undefined,
          notes: data.notes || undefined,
          rating: data.ai_rating || 0,
          user_id: data.user_id || undefined,
          job_id: data.job_id || undefined,
          ai_rating: data.ai_rating,
          ai_summary: data.ai_summary,
          ai_content: data.ai_content,
          current_job_title: data.current_job_title,
          location: data.location,
          years_experience: data.years_experience,
          skills: data.skills,
          certifications: data.certifications,
          companies: data.companies,
          graduation_years: data.graduation_years,
          institutions: data.institutions,
          job_titles: data.job_titles,
          full_name: data.full_name,
          linkedin: data.linkedin,
          degrees: data.degrees,
          source: data.source,
          experience_level: data.experience_level,
          suitable_role: data.suitable_role
        };
        
        return newCandidate;
      }
      
      return null;
    } catch (err: any) {
      console.error('Error creating candidate:', err.message);
      toast.error('Failed to create candidate');
      return null;
    }
  },
  
  // Update a candidate
  updateCandidate: async (id: string, updates: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      // Map the updates to match the candidates table schema
      const candidateUpdates: any = {};
      
      if (updates.name !== undefined) candidateUpdates.full_name = updates.name;
      if (updates.full_name !== undefined) candidateUpdates.full_name = updates.full_name;
      if (updates.email !== undefined) candidateUpdates.email = updates.email;
      if (updates.phone !== undefined) candidateUpdates.phone = updates.phone;
      if (updates.resume_url !== undefined) candidateUpdates.resume_url = updates.resume_url;
      if (updates.status !== undefined) candidateUpdates.status = updates.status;
      if (updates.notes !== undefined) candidateUpdates.notes = updates.notes;
      if (updates.rating !== undefined) candidateUpdates.ai_rating = updates.rating;
      if (updates.ai_rating !== undefined) candidateUpdates.ai_rating = updates.ai_rating;
      if (updates.ai_summary !== undefined) candidateUpdates.ai_summary = updates.ai_summary;
      if (updates.ai_content !== undefined) candidateUpdates.ai_content = updates.ai_content;
      if (updates.current_job_title !== undefined) candidateUpdates.current_job_title = updates.current_job_title;
      if (updates.location !== undefined) candidateUpdates.location = updates.location;
      if (updates.years_experience !== undefined) candidateUpdates.years_experience = updates.years_experience;
      if (updates.skills !== undefined) candidateUpdates.skills = updates.skills;
      if (updates.certifications !== undefined) candidateUpdates.certifications = updates.certifications;
      if (updates.companies !== undefined) candidateUpdates.companies = updates.companies;
      if (updates.graduation_years !== undefined) candidateUpdates.graduation_years = updates.graduation_years;
      if (updates.institutions !== undefined) candidateUpdates.institutions = updates.institutions;
      if (updates.job_titles !== undefined) candidateUpdates.job_titles = updates.job_titles;
      if (updates.linkedin !== undefined) candidateUpdates.linkedin = updates.linkedin;
      if (updates.degrees !== undefined) candidateUpdates.degrees = updates.degrees;
      if (updates.experience_level !== undefined) candidateUpdates.experience_level = updates.experience_level;
      if (updates.suitable_role !== undefined) candidateUpdates.suitable_role = updates.suitable_role;

      // Store the original job_id to check if it changed
      let originalJobId = null;
      if (updates.job_id) {
        // Get the original candidate first to check if job_id changed
        const { data: originalCandidate } = await supabase
          .from('candidates')
          .select('job_id')
          .eq('id', id)
          .single();
          
        if (originalCandidate) {
          originalJobId = originalCandidate.job_id;
        }
        
        candidateUpdates.job_id = updates.job_id;
      }
      
      const { data, error } = await supabase
        .from('candidates')
        .update(candidateUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // If the job ID changed, update the applicants counts for both jobs
      if (updates.job_id && originalJobId !== updates.job_id) {
        if (originalJobId) {
          await supabase.rpc('decrement_job_applicants', { job_id: originalJobId });
        }
        await supabase.rpc('increment_job_applicants', { job_id: updates.job_id });
      }
      
      toast.success('Candidate updated successfully');
      
      // Map the response to match our Candidate type
      if (data) {
        const updatedCandidate: Candidate = {
          id: data.id,
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          resume_url: data.resume_url || undefined,
          applied_date: data.timestamp,
          status: data.status || undefined,
          notes: data.notes || undefined,
          rating: data.ai_rating || 0,
          user_id: data.user_id || undefined,
          job_id: data.job_id || undefined,
          ai_rating: data.ai_rating,
          ai_summary: data.ai_summary,
          ai_content: data.ai_content,
          current_job_title: data.current_job_title,
          location: data.location,
          years_experience: data.years_experience,
          skills: data.skills,
          certifications: data.certifications,
          companies: data.companies,
          graduation_years: data.graduation_years,
          institutions: data.institutions,
          job_titles: data.job_titles,
          full_name: data.full_name,
          linkedin: data.linkedin,
          degrees: data.degrees,
          source: data.source,
          experience_level: data.experience_level,
          suitable_role: data.suitable_role
        };
        
        return updatedCandidate;
      }
      
      return null;
    } catch (err: any) {
      console.error('Error updating candidate:', err.message);
      toast.error('Failed to update candidate');
      return null;
    }
  },
  
  // Delete a candidate
  deleteCandidate: async (id: string): Promise<boolean> => {
    try {
      // Get the candidate first to get the job_id if any
      const { data: candidate } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // If the candidate was associated with a job, decrease the applicants count
      if (candidate && candidate.job_id) {
        await supabase.rpc('decrement_job_applicants', { job_id: candidate.job_id });
      }
      
      toast.success('Candidate deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting candidate:', err.message);
      toast.error('Failed to delete candidate');
      return false;
    }
  },

  // Upload resume file
  uploadResume: async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);
        
      if (error) {
        throw error;
      }

      // Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(data.path);
      
      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading resume:', err.message);
      toast.error('Failed to upload resume');
      return null;
    }
  }
};
