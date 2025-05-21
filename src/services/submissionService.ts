
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Submission = {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  status: string;
  job_id: string | null;
  created_at: string;
};

export type JobApplication = {
  id: string;
  cv_link_id: string;
  job_id: string;
  created_at: string;
};

export const submissionService = {
  // Get all submissions
  getSubmissions: async (): Promise<Submission[]> => {
    try {
      const { data, error } = await supabase
        .from('cv_links')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching submissions:', err.message);
      toast.error('Failed to load submissions');
      return [];
    }
  },

  // Get job application details by cv_link_id
  getJobApplicationByCvLinkId: async (cvLinkId: string): Promise<JobApplication | null> => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('cv_link_id', cvLinkId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching job application:', err.message);
      return null;
    }
  },

  // Get submission by id
  getSubmissionById: async (id: string): Promise<Submission | null> => {
    try {
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching submission:', err.message);
      toast.error('Failed to load submission');
      return null;
    }
  }
};
