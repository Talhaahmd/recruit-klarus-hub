
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  status: string;
  posted_date: string;
  active_days: number;
  applicants: number;
  technologies: string[];
  workplace_type: string;
  apply_link?: string; // Added the apply_link field
  user_id?: string;
};

// The JobInput type should match what's expected by the database
export type JobInput = Omit<Job, 'id'>;

export const jobsService = {
  // Get all jobs for current user
  getJobs: async (): Promise<Job[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      console.log('Fetched jobs from Supabase:', data);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching jobs:', err.message);
      toast.error('Failed to load jobs');
      return [];
    }
  },
  
  // Get a job by ID
  getJobById: async (id: string): Promise<Job | null> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching job:', err.message);
      toast.error('Failed to load job');
      return null;
    }
  },
  
  // Create a new job
  createJob: async (job: JobInput): Promise<Job | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create a job');
        return null;
      }
      
      const jobData = {
        ...job,
        user_id: user.id
      };
      
      console.log('Creating job with data:', jobData);
      
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
  
  // Update a job
  updateJob: async (id: string, updates: Partial<Job>): Promise<Job | null> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast.success('Job updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating job:', err.message);
      toast.error('Failed to update job');
      return null;
    }
  },
  
  // Delete a job
  deleteJob: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Job deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting job:', err.message);
      toast.error('Failed to delete job');
      return false;
    }
  }
};
