
import { supabase, JobRow } from '@/lib/supabase';
import { toast } from "sonner";

// Type definition for frontend usage
export type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  status: string;
  applicants: number;
  postedDate: string;
  technologies: string[];
  workplaceType: string;
  complexity: string;
  qualification: string;
  activeDays: number;
};

// Convert database row to frontend format
const toJob = (row: JobRow): Job => ({
  id: row.id,
  title: row.title,
  description: row.description,
  location: row.location,
  type: row.type,
  status: row.status,
  applicants: row.applicants,
  postedDate: row.posted_date,
  technologies: row.technologies,
  workplaceType: row.workplace_type,
  complexity: row.complexity,
  qualification: row.qualification,
  activeDays: row.active_days,
});

// Convert frontend data to database format
const toJobRow = (job: Omit<Job, 'id'>, userId: string): Omit<JobRow, 'id' | 'created_at'> => ({
  title: job.title,
  description: job.description,
  location: job.location,
  type: job.type,
  status: 'Active',
  applicants: 0,
  posted_date: new Date().toISOString().split('T')[0],
  technologies: job.technologies,
  workplace_type: job.workplaceType,
  complexity: job.complexity,
  qualification: job.qualification || 'None',
  active_days: job.activeDays,
  user_id: userId,
});

export const jobsService = {
  // Get all jobs for the current user
  getJobs: async (): Promise<Job[]> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
        return [];
      }
      
      return data.map(toJob);
    } catch (err) {
      console.error('Unexpected error fetching jobs:', err);
      toast.error('Failed to load jobs');
      return [];
    }
  },
  
  // Get a specific job by ID
  getJob: async (id: string): Promise<Job | null> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
        return null;
      }
      
      return toJob(data);
    } catch (err) {
      console.error('Unexpected error fetching job:', err);
      toast.error('Failed to load job details');
      return null;
    }
  },
  
  // Create a new job
  createJob: async (job: Omit<Job, 'id'>): Promise<Job | null> => {
    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You must be logged in to create a job');
        return null;
      }
      
      const jobData = toJobRow(job, userData.user.id);
      
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating job:', error);
        toast.error('Failed to create job');
        return null;
      }
      
      toast.success('Job created successfully');
      return toJob(data);
    } catch (err) {
      console.error('Unexpected error creating job:', err);
      toast.error('Failed to create job');
      return null;
    }
  },
  
  // Update an existing job
  updateJob: async (id: string, job: Partial<Job>): Promise<Job | null> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.type,
          status: job.status,
          technologies: job.technologies,
          workplace_type: job.workplaceType,
          complexity: job.complexity,
          qualification: job.qualification,
          active_days: job.activeDays,
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating job:', error);
        toast.error('Failed to update job');
        return null;
      }
      
      toast.success('Job updated successfully');
      return toJob(data);
    } catch (err) {
      console.error('Unexpected error updating job:', err);
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
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job');
        return false;
      }
      
      toast.success('Job deleted successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error deleting job:', err);
      toast.error('Failed to delete job');
      return false;
    }
  },
};
