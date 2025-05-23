
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const submissionService = {
  uploadResume: async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
      throw error;
    }
  },
  
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
      
      // First insert the CV link
      const { data: cvLink, error: cvError } = await supabase
        .from('cv_links')
        .insert({
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileType,
          job_id: jobId
        })
        .select('id')
        .single();
        
      if (cvError) throw cvError;
      
      // If job ID is provided, create a job application
      if (jobId && cvLink) {
        // Get job details for logging
        const { data: jobData } = await supabase
          .from('jobs')
          .select('title')
          .eq('id', jobId)
          .single();
        
        // Create job application
        const { error: appError } = await supabase
          .from('job_applications')
          .insert({
            job_id: jobId,
            cv_link_id: cvLink.id,
            job_name: jobData?.title || 'Unknown Job',
            link_for_cv: fileUrl
          });
          
        if (appError) throw appError;
        
        // Increment job applicant count
        const { error: incError } = await supabase
          .rpc('increment_job_applicants', { job_id: jobId });
          
        if (incError) {
          console.error('Error incrementing applicant count:', incError);
          // Don't throw as the submission was successful
        }
      }
      
      return cvLink?.id || '';
    } catch (error: any) {
      console.error('Error creating submission:', error);
      toast.error('Failed to process submission');
      throw error;
    }
  },
  
  getSubmissions: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to view submissions');
        return [];
      }
      
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
      return [];
    }
  },
  
  getSubmissionById: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to view this submission');
        return null;
      }
      
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching submission:', error);
      toast.error('Failed to load submission details');
      return null;
    }
  },
  
  getJobApplicationByCvLinkId: async (cvLinkId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to view this application');
        return null;
      }
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('cv_link_id', cvLinkId)
        .single();
        
      if (error && error.code !== 'PGRST116') {  // PGRST116 is "no rows returned" which is fine
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching job application:', error);
      toast.error('Failed to load application details');
      return null;
    }
  },
  
  scheduleInterview: async (interviewData: {
    candidate_id: string;
    interview_date: Date;
    interview_time?: string;
    candidate_name?: string;
    candidate_email?: string;
    job_name?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to schedule an interview');
        return null;
      }
      
      const { data, error } = await supabase
        .from('candidate_interviews')
        .insert(interviewData)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Interview scheduled successfully');
      return data;
    } catch (error: any) {
      console.error('Error scheduling interview:', error);
      toast.error('Failed to schedule interview');
      return null;
    }
  }
};
