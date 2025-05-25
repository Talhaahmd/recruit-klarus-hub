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

// Helper function to safely cast workplace_type
const mapWorkplaceType = (type: string): 'remote' | 'hybrid' | 'onsite' => {
  if (type === 'remote' || type === 'hybrid' || type === 'onsite') {
    return type;
  }
  return 'remote'; // default fallback
};

// Helper function to safely cast job_type
const mapJobType = (type: string): 'fulltime' | 'contract' | 'internship' => {
  if (type === 'fulltime' || type === 'contract' || type === 'internship') {
    return type;
  }
  return 'fulltime'; // default fallback
};

export const newJobsService = {
  getJobs: async (): Promise<NewJob[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated, cannot fetch jobs');
        return [];
      }

      // Map old schema to new schema
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
      
      // Transform old schema to new schema format
      return (data || []).map(job => ({
        id: job.id,
        title: job.title,
        workplace_type: mapWorkplaceType(job.workplace_type),
        location: job.location,
        job_type: mapJobType(job.type),
        description: job.description,
        technologies: job.technologies || [],
        minimum_rating: 0, // Default since old schema doesn't have this
        hr_user_id: job.user_id || user.id,
        created_at: job.created_at,
        updated_at: job.created_at
      }));
    } catch (err: any) {
      console.error('Error fetching jobs:', err.message);
      toast.error('Failed to load jobs: ' + err.message);
      return [];
    }
  },
  
  getJobById: async (id: string): Promise<NewJob | null> => {
    try {
      console.log('Fetching job with ID:', id);
      
      // Validate the job ID format
      if (!id || id.trim() === '') {
        console.error('Invalid job ID: empty or null');
        return null;
      }
      
      // Use a direct query without authentication check for public access
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) {
        console.error('Database error fetching job:', error);
        return null;
      }
      
      if (!data) {
        console.log('No job found with ID:', id);
        return null;
      }
      
      console.log('Job data found:', data);
      
      // Transform old schema to new schema format
      return {
        id: data.id,
        title: data.title,
        workplace_type: mapWorkplaceType(data.workplace_type),
        location: data.location,
        job_type: mapJobType(data.type),
        description: data.description,
        technologies: data.technologies || [],
        minimum_rating: 0,
        hr_user_id: data.user_id || '',
        created_at: data.created_at,
        updated_at: data.created_at
      };
    } catch (err: any) {
      console.error('Error fetching job:', err.message);
      return null;
    }
  },
  
  createJob: async (job: NewJobInput): Promise<NewJob | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a job');
      }
      
      // Map new schema to old schema
      const jobData = {
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.job_type,
        workplace_type: job.workplace_type,
        technologies: job.technologies,
        user_id: user.id
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
      
      // Transform response back to new schema
      return {
        id: data.id,
        title: data.title,
        workplace_type: mapWorkplaceType(data.workplace_type),
        location: data.location,
        job_type: mapJobType(data.type),
        description: data.description,
        technologies: data.technologies || [],
        minimum_rating: 0,
        hr_user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.created_at
      };
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
      
      // Map new schema updates to old schema
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.location) updateData.location = updates.location;
      if (updates.job_type) updateData.type = updates.job_type;
      if (updates.workplace_type) updateData.workplace_type = updates.workplace_type;
      if (updates.technologies) updateData.technologies = updates.technologies;
      
      const { data, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating job:', error);
        throw error;
      }
      
      toast.success('Job updated successfully');
      
      // Transform response back to new schema
      return {
        id: data.id,
        title: data.title,
        workplace_type: mapWorkplaceType(data.workplace_type),
        location: data.location,
        job_type: mapJobType(data.type),
        description: data.description,
        technologies: data.technologies || [],
        minimum_rating: 0,
        hr_user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.created_at
      };
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
