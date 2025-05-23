
import { supabase } from '@/lib/supabase';
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
  user_id?: string;
  created_by?: string;
};

// The JobInput type should match what's expected by the database
export type JobInput = Omit<Job, 'id'>;

export const jobsService = {
  // Get all jobs for current user - RLS will automatically filter to just the user's jobs
  getJobs: async (): Promise<Job[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch jobs');
        return [];
      }

      console.log('Fetching jobs for user:', user.id); // Debug log
      
      // No need to filter by user_id, RLS will handle this
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });
        
      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
      
      console.log('Fetched jobs from Supabase:', data);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching jobs:', err.message);
      toast.error('Failed to load jobs: ' + err.message);
      return [];
    }
  },
  
  // Get a job by ID - RLS will ensure users can only access their own jobs
  getJobById: async (id: string): Promise<Job | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch job');
        toast.error('You must be logged in to view job details');
        return null;
      }

      console.log('Fetching job:', id, 'for user:', user.id); // Debug log
      
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
  
  // Create a new job
  createJob: async (job: JobInput): Promise<Job | null> => {
    try {
      // First, explicitly check authentication status
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      if (!sessionData.session || !sessionData.session.user) {
        console.error('No session or user found');
        throw new Error('You must be logged in to create a job');
      }
      
      const user = sessionData.session.user;
      console.log('Creating job with authenticated user:', user.id);
      
      // Ensure the user_id is set correctly - this will map to created_by in RLS policies
      const jobData = {
        ...job,
        user_id: user.id
      };
      
      console.log('Creating job with data:', jobData); // Debug log
      
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
  
  // Update a job - RLS will ensure users can only update their own jobs
  updateJob: async (id: string, updates: Partial<Job>): Promise<Job | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot update job');
        toast.error('You must be logged in to update jobs');
        return null;
      }

      console.log('Updating job:', id, 'for user:', user.id); // Debug log
      
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
  
  // Delete a job - RLS will ensure users can only delete their own jobs
  deleteJob: async (id: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot delete job');
        toast.error('You must be logged in to delete jobs');
        return false;
      }

      console.log('Deleting job:', id, 'for user:', user.id); // Debug log
      
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
