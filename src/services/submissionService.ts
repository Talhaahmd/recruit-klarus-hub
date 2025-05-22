import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const submissionService = {
  uploadResume: async (file: File): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to upload a resume');
        return null;
      }
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('candidate-files')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase
        .storage
        .from('candidate-files')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
      return null;
    }
  },
  
  createSubmission: async (fileUrl: string, fileName: string, fileSize: number, fileType: string, jobId?: string): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a submission');
        return null;
      }
      
      // Insert the CV link record
      const { data: cvLink, error } = await supabase
        .from('cv_links')
        .insert({
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileType,
          job_id: jobId,
          user_id: user.id // Add the user_id field here
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Create a job application if a job ID was provided
      if (jobId) {
        const { error: applicationError } = await supabase
          .from('job_applications')
          .insert({
            job_id: jobId,
            cv_link_id: cvLink.id,
            user_id: user.id // Add the user_id field here
          });
        
        if (applicationError) {
          console.error('Error creating job application:', applicationError);
          // Continue anyway since the CV upload succeeded
        }
      }
      
      return cvLink.id;
    } catch (error: any) {
      console.error('Error creating submission:', error);
      toast.error('Failed to create submission');
      return null;
    }
  },
  
  getSubmissions: async () => {
    try {
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
      return [];
    }
  },
  
  getSubmissionById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching submission:', error);
      return null;
    }
  },
  
  getJobApplicationByCvLinkId: async (cvLinkId: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*, jobs:job_id(*)')
        .eq('cv_link_id', cvLinkId)
        .single();
      
      if (error) {
        // Not found is OK - might not have an application
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching job application:', error);
      return null;
    }
  },
  
  updateSubmissionStatus: async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('cv_links')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success(`Submission status updated to ${status}`);
      return data;
    } catch (error: any) {
      console.error('Error updating submission status:', error);
      toast.error('Failed to update submission status');
      return null;
    }
  },
  
  // Add the scheduleInterview function
  scheduleInterview: async (
    candidateId: string,
    interviewDate: string,
    interviewTime: string,
    interviewNotes: string,
    candidateName: string,
    candidateEmail: string,
    jobName?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('candidate_interviews')
        .insert({
          candidate_id: candidateId,
          interview_date: interviewDate,
          interview_time: interviewTime,
          interview_notes: interviewNotes,
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          job_name: jobName || '',
          email_sent: false, // To be handled by a background job
        });

      if (error) {
        throw error;
      }

      toast.success('Interview scheduled successfully');
      return true;
    } catch (err: any) {
      console.error('Error scheduling interview:', err.message);
      toast.error('Failed to schedule interview');
      return false;
    }
  }
};
