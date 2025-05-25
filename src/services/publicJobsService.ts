
import { supabase } from '@/integrations/supabase/client';

export type PublicJob = {
  id: string;
  title: string;
  workplace_type: 'remote' | 'hybrid' | 'onsite';
  location: string;
  job_type: 'fulltime' | 'contract' | 'internship';
  description: string;
  technologies: string[];
  created_at: string;
};

// Helper function to safely cast workplace_type
const mapWorkplaceType = (type: string): 'remote' | 'hybrid' | 'onsite' => {
  if (type === 'remote' || type === 'hybrid' || type === 'onsite') {
    return type;
  }
  return 'remote';
};

// Helper function to safely cast job_type
const mapJobType = (type: string): 'fulltime' | 'contract' | 'internship' => {
  if (type === 'fulltime' || type === 'contract' || type === 'internship') {
    return type;
  }
  return 'fulltime';
};

export const publicJobsService = {
  getJobById: async (id: string): Promise<PublicJob | null> => {
    try {
      console.log('Fetching public job with ID:', id);
      
      if (!id || id.trim() === '') {
        console.error('Invalid job ID: empty or null');
        return null;
      }
      
      // Use the existing supabase client for public access
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, workplace_type, location, type, description, technologies, created_at, status')
        .eq('id', id)
        .eq('status', 'Active') // Only fetch active jobs for public access
        .maybeSingle();
        
      if (error) {
        console.error('Database error fetching public job:', error);
        return null;
      }
      
      if (!data) {
        console.log('No active job found with ID:', id);
        return null;
      }
      
      console.log('Public job data found:', data);
      
      return {
        id: data.id,
        title: data.title,
        workplace_type: mapWorkplaceType(data.workplace_type),
        location: data.location,
        job_type: mapJobType(data.type),
        description: data.description,
        technologies: data.technologies || [],
        created_at: data.created_at,
      };
    } catch (err: any) {
      console.error('Error fetching public job:', err.message);
      return null;
    }
  }
};
