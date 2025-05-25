
import { createClient } from '@supabase/supabase-js';

// Create a separate client for public access
const SUPABASE_URL = "https://bzddkmmjqwgylckimwiq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZGRrbW1qcXdneWxja2ltd2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDUyNTIsImV4cCI6MjA2MzI4MTI1Mn0.TJ-WarxEHdsEbsychuwRHaKDtWQcWK3Yl5-zqAO4Ow0";

const publicSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false // Don't persist sessions for public access
  }
});

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
      
      const { data, error } = await publicSupabase
        .from('jobs')
        .select('id, title, workplace_type, location, type, description, technologies, created_at')
        .eq('id', id)
        .eq('status', 'Active') // Only fetch active jobs
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
