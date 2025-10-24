
import { interviewService } from './interviewService';
import { newApplicationService } from './newApplicationService';
import { supabase } from '@/lib/supabase';

// Re-export all services for backward compatibility
export const submissionService = {
  ...interviewService,
  ...newApplicationService,
  
  // Add missing methods that components expect
  getSubmissionById: async (submissionId: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id', submissionId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching submission:', error);
      return null;
    }
  },
  
  getJobApplicationByCvLinkId: async (cvLinkId: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('cv_link', cvLinkId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching job application:', error);
      return null;
    }
  }
};

// Export individual services
export { interviewService } from './interviewService';
export { newApplicationService } from './newApplicationService';
