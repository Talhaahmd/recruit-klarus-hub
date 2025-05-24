
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type NewJob = {
  id: string;
  title: string;
  workplace_type: 'remote' | 'hybrid' | 'onsite';
  location: string;
  job_type: 'fulltime' | 'contract' | 'internship';
  description: string;
  technologies: string[];
  minimum_rating: number;
  hr_user_id: string;
  created_at: string;
  updated_at: string;
};

export type NewJobInput = Omit<NewJob, 'id' | 'hr_user_id' | 'created_at' | 'updated_at'>;

export const newJobsService = {
  getJobs: async (): Promise<NewJob[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch jobs');
        return [];
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching jobs:', err.message);
      toast.error('Failed to load jobs: ' + err.message);
      return [];
    }
  },
  
  getJobById: async (id: string): Promise<NewJob | null> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching job:', error);
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching job:', err.message);
      toast.error('Failed to load job: ' + err.message);
      return null;
    }
  },
  
  createJob: async (job: NewJobInput): Promise<NewJob | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a job');
      }
      
      const jobData = {
        ...job,
        hr_user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single();
        
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      toast.success('Job created successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating job:', err.message);
      toast.error(`Failed to create job: ${err.message || 'Unknown error'}`);
      return null;
    }
  },
  
  updateJob: async (id: string, updates: Partial<NewJobInput>): Promise<NewJob | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to update jobs');
        return null;
      }
      
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating job:', error);
        throw error;
      }
      
      toast.success('Job updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating job:', err.message);
      toast.error('Failed to update job: ' + err.message);
      return null;
    }
  },
  
  deleteJob: async (id: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to delete jobs');
        return false;
      }
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting job:', error);
        throw error;
      }
      
      toast.success('Job deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting job:', err.message);
      toast.error('Failed to delete job: ' + err.message);
      return false;
    }
  }
};
