import { supabase } from '@/lib/supabase';
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
        .order('timestamp', { ascending: false });
        
      if (error) {
        console.error('Error fetching candidates:', error);
        throw error;
      }
      
      // Transform database records to NewCandidate format
      return (data || []).map(candidate => ({
        id: candidate.id,
        full_name: candidate.full_name || '',
        email: candidate.email || '',
        phone: candidate.phone,
        linkedin_link: candidate.linkedin,
        education: candidate.degrees,
        institute: candidate.institutions,
        current_job: candidate.current_job_title,
        years_experience: candidate.years_experience ? parseInt(candidate.years_experience) : undefined,
        skills: candidate.skills ? candidate.skills.split(',').map(s => s.trim()) : [],
        certification: candidate.certifications,
        companies: candidate.companies,
        current_job_title: candidate.current_job_title,
        graduation_years: candidate.graduation_years,
        experience_level: candidate.experience_level,
        ai_rating: candidate.ai_rating,
        ai_summary: candidate.ai_summary,
        ai_content: candidate.ai_content,
        job_id: candidate.job_id,
        hr_user_id: user.id, // Use current user as hr_user_id
        created_at: candidate.timestamp || new Date().toISOString(),
        updated_at: candidate.timestamp || new Date().toISOString()
      }));
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
      
      // Transform database record to NewCandidate format
      return {
        id: data.id,
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone,
        linkedin_link: data.linkedin,
        education: data.degrees,
        institute: data.institutions,
        current_job: data.current_job_title,
        years_experience: data.years_experience ? parseInt(data.years_experience) : undefined,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
        certification: data.certifications,
        companies: data.companies,
        current_job_title: data.current_job_title,
        graduation_years: data.graduation_years,
        experience_level: data.experience_level,
        ai_rating: data.ai_rating,
        ai_summary: data.ai_summary,
        ai_content: data.ai_content,
        job_id: data.job_id,
        hr_user_id: user.id,
        created_at: data.timestamp || new Date().toISOString(),
        updated_at: data.timestamp || new Date().toISOString()
      };
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

      // Map NewCandidate updates to database schema
      const dbUpdates: any = {};
      if (updates.full_name !== undefined) dbUpdates.full_name = updates.full_name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.linkedin_link !== undefined) dbUpdates.linkedin = updates.linkedin_link;
      if (updates.education !== undefined) dbUpdates.degrees = updates.education;
      if (updates.institute !== undefined) dbUpdates.institutions = updates.institute;
      if (updates.current_job !== undefined) dbUpdates.current_job_title = updates.current_job;
      if (updates.years_experience !== undefined) dbUpdates.years_experience = updates.years_experience?.toString();
      if (updates.skills !== undefined) dbUpdates.skills = updates.skills?.join(', ');
      if (updates.certification !== undefined) dbUpdates.certifications = updates.certification;
      if (updates.companies !== undefined) dbUpdates.companies = updates.companies;
      if (updates.graduation_years !== undefined) dbUpdates.graduation_years = updates.graduation_years;
      if (updates.experience_level !== undefined) dbUpdates.experience_level = updates.experience_level;
      if (updates.ai_rating !== undefined) dbUpdates.ai_rating = updates.ai_rating;
      if (updates.ai_summary !== undefined) dbUpdates.ai_summary = updates.ai_summary;
      if (updates.ai_content !== undefined) dbUpdates.ai_content = updates.ai_content;

      const { data, error } = await supabase
        .from('candidates')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating candidate:', error);
        throw error;
      }
      
      toast.success('Candidate updated successfully');
      
      // Transform back to NewCandidate format
      return {
        id: data.id,
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone,
        linkedin_link: data.linkedin,
        education: data.degrees,
        institute: data.institutions,
        current_job: data.current_job_title,
        years_experience: data.years_experience ? parseInt(data.years_experience) : undefined,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
        certification: data.certifications,
        companies: data.companies,
        current_job_title: data.current_job_title,
        graduation_years: data.graduation_years,
        experience_level: data.experience_level,
        ai_rating: data.ai_rating,
        ai_summary: data.ai_summary,
        ai_content: data.ai_content,
        job_id: data.job_id,
        hr_user_id: user.id,
        created_at: data.timestamp || new Date().toISOString(),
        updated_at: data.timestamp || new Date().toISOString()
      };
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
