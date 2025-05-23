
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Candidate = {
  id: string;
  job_id?: string;
  name?: string;
  email: string;
  phone?: string;
  resume_url?: string;
  applied_date?: string;
  status?: string;
  notes?: string;
  rating: number; // Required property
  user_id?: string;
  created_by?: string;
  created_at?: string;
  // Extended candidate properties
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
};

export const candidatesService = {
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch candidates');
        return [];
      }

      console.log('Fetching candidates for user:', user.id); // Debug log
      
      // No need to filter by created_by since RLS will handle this automatically
      const { data, error } = await supabase
        .from('candidates')
        .select('*');

      if (error) {
        console.error('Error fetching candidates:', error);
        throw error;
      }

      console.log('Fetched candidates:', data);
      
      // Create a properly typed candidates array with the required rating property
      const candidates: Candidate[] = [];
      
      if (data && Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          candidates.push({
            ...data[i],
            rating: data[i].ai_rating || 0
          });
        }
      }
      
      return candidates;
    } catch (error: any) {
      console.error('Error in getCandidates:', error.message);
      toast.error('Failed to fetch candidates');
      return [];
    }
  },

  getCandidatesByJob: async (jobId: string): Promise<Candidate[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch candidates');
        return [];
      }
      
      // Get job applications for this job
      const { data: applications, error: appError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId);
      
      if (appError) {
        console.error('Error fetching job applications:', appError);
        return [];
      }
      
      if (!applications || applications.length === 0) {
        return [];
      }
      
      // Get all candidates from the job applications
      // Use an explicit typed array to avoid TypeScript deep instantiation error
      const candidates: Candidate[] = [];
      
      for (const app of applications) {
        try {
          // Get candidate ID from application
          let candidateId = '';
          
          // If cv_link_id is available, try to get the candidate from that
          if (app.cv_link_id) {
            const { data: cvLink } = await supabase
              .from('cv_links')
              .select('id')
              .eq('id', app.cv_link_id)
              .single();
              
            if (cvLink) {
              candidateId = cvLink.id;
            }
          }
          
          if (candidateId) {
            const { data: candidate } = await supabase
              .from('candidates')
              .select('*')
              .eq('id', candidateId)
              .single();
              
            if (candidate) {
              // Explicitly set the rating property to fix type error
              candidates.push({
                ...candidate,
                rating: candidate.ai_rating || 0
              });
            }
          }
        } catch (err) {
          console.error('Error fetching candidate details:', err);
        }
      }
      
      return candidates;
    } catch (err: any) {
      console.error('Error in getCandidatesByJob:', err.message);
      return [];
    }
  },

  getCandidateById: async (id: string): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch candidate');
        return null;
      }
      
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Add rating property to the candidate
      if (data) {
        return {
          ...data,
          rating: data.ai_rating || 0
        };
      }
      
      return null;
    } catch (error: any) {
      console.error('Error in getCandidateById:', error.message);
      toast.error('Failed to fetch candidate details');
      return null;
    }
  },

  createCandidate: async (candidate: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create candidates');
        return null;
      }
      
      // Ensure rating is set and add created_by field
      const candidateData = {
        ...candidate,
        user_id: user.id,
        created_by: user.id, // Add created_by field for RLS
        rating: candidate.rating || candidate.ai_rating || 0
      };
      
      const { data, error } = await supabase
        .from('candidates')
        .insert(candidateData)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Candidate created successfully');
      return {
        ...data,
        rating: data.ai_rating || 0
      };
    } catch (error: any) {
      console.error('Error in createCandidate:', error.message);
      toast.error('Failed to create candidate');
      return null;
    }
  },

  updateCandidate: async (id: string, updates: Partial<Candidate>): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to update candidates');
        return null;
      }
      
      // Ensure rating is set correctly
      const updateData = {
        ...updates,
        rating: updates.rating || updates.ai_rating || 0
      };
      
      const { data, error } = await supabase
        .from('candidates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Candidate updated successfully');
      return {
        ...data,
        rating: data.ai_rating || 0
      };
    } catch (error: any) {
      console.error('Error in updateCandidate:', error.message);
      toast.error('Failed to update candidate');
      return null;
    }
  },

  deleteCandidate: async (id: string, jobId?: string): Promise<boolean> => {
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
        
      if (error) throw error;
      
      // If job_id is provided, decrement the applicants count
      if (jobId) {
        const { error: jobError } = await supabase
          .rpc('decrement_job_applicants', { job_id: jobId });
          
        if (jobError) {
          console.error('Error decrementing job applicants:', jobError);
          // Don't throw, as the candidate was already deleted
        }
      }
      
      toast.success('Candidate deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error in deleteCandidate:', error.message);
      toast.error('Failed to delete candidate');
      return false;
    }
  }
};
