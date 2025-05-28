import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const cvSubmissionService = {
  createSubmission: async (
    fileUrl: string, 
    fileName: string, 
    fileSize: number, 
    fileType: string,
    jobId?: string
  ): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to submit a resume');
        throw new Error('Authentication required');
      }
      
      // Use the new job_applications table instead
      if (jobId) {
        const { data: jobData } = await supabase
          .from('jobs')
          .select('title')
          .eq('id', jobId)
          .single();
        
        const { data, error } = await supabase
          .from('job_applications')
          .insert({
            job_id: jobId,
            job_name: jobData?.title || 'Unknown Job',
            cv_link: fileUrl
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        return data?.id || '';
      }
      
      return '';
    } catch (error: any) {
      console.error('Error creating submission:', error);
      toast.error('Failed to process submission');
      throw error;
    }
  },
  
  getSubmissions: async () => {
    toast.error('This feature is being updated. Please use the new application system.');
    return [];
  },
  
  getSubmissionById: async (id: string) => {
    toast.error('This feature is being updated. Please use the new application system.');
    return null;
  },
  
  getJobApplicationByCvLinkId: async (cvLinkId: string) => {
    toast.error('This feature is being updated. Please use the new application system.');
    return null;
  }
};
