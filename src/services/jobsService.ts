
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

type JobInput = Omit<Job, 'id' | 'applicants'>;

export const jobsService = {
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

      // Transform data to match our frontend Job type
      return data.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.type,
        status: job.status,
        applicants: job.applicants,
        postedDate: job.posted_date,
        technologies: job.technologies,
        workplaceType: job.workplace_type,
        complexity: job.complexity,
        qualification: job.qualification || '',
        activeDays: job.active_days
      }));
    } catch (err) {
      console.error('Unexpected error fetching jobs:', err);
      toast.error('Failed to load jobs');
      return [];
    }
  },

  getJobById: async (id: string): Promise<Job | null> => {
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

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        location: data.location,
        type: data.type,
        status: data.status,
        applicants: data.applicants,
        postedDate: data.posted_date,
        technologies: data.technologies,
        workplaceType: data.workplace_type,
        complexity: data.complexity,
        qualification: data.qualification || '',
        activeDays: data.active_days
      };
    } catch (err) {
      console.error('Unexpected error fetching job by id:', err);
      toast.error('Failed to load job details');
      return null;
    }
  },

  createJob: async (job: JobInput): Promise<Job | null> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.type,
          status: job.status,
          posted_date: job.postedDate,
          technologies: job.technologies,
          workplace_type: job.workplaceType,
          complexity: job.complexity,
          qualification: job.qualification,
          active_days: job.activeDays
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating job:', error);
        toast.error('Failed to create job');
        return null;
      }

      toast.success('Job created successfully');
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        location: data.location,
        type: data.type,
        status: data.status,
        applicants: data.applicants,
        postedDate: data.posted_date,
        technologies: data.technologies,
        workplaceType: data.workplace_type,
        complexity: data.complexity,
        qualification: data.qualification || '',
        activeDays: data.active_days
      };
    } catch (err) {
      console.error('Unexpected error creating job:', err);
      toast.error('Failed to create job');
      return null;
    }
  },

  updateJob: async (id: string, job: Partial<JobInput>): Promise<boolean> => {
    try {
      // Convert from frontend to database field names
      const dbJob: any = {};
      if (job.title !== undefined) dbJob.title = job.title;
      if (job.description !== undefined) dbJob.description = job.description;
      if (job.location !== undefined) dbJob.location = job.location;
      if (job.type !== undefined) dbJob.type = job.type;
      if (job.status !== undefined) dbJob.status = job.status;
      if (job.postedDate !== undefined) dbJob.posted_date = job.postedDate;
      if (job.technologies !== undefined) dbJob.technologies = job.technologies;
      if (job.workplaceType !== undefined) dbJob.workplace_type = job.workplaceType;
      if (job.complexity !== undefined) dbJob.complexity = job.complexity;
      if (job.qualification !== undefined) dbJob.qualification = job.qualification;
      if (job.activeDays !== undefined) dbJob.active_days = job.activeDays;

      const { error } = await supabase
        .from('jobs')
        .update(dbJob)
        .eq('id', id);

      if (error) {
        console.error('Error updating job:', error);
        toast.error('Failed to update job');
        return false;
      }

      toast.success('Job updated successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error updating job:', err);
      toast.error('Failed to update job');
      return false;
    }
  },

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
  }
};
