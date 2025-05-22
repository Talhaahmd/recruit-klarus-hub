import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const submissionService = {
  // Add the scheduleInterview function
  scheduleInterview: async (
    candidateId: string,
    interviewDate: string,
    interviewTime: string,
    notes: string,
    candidateName?: string,
    candidateEmail?: string,
    jobName?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('candidate_interviews')
        .insert({
          candidate_id: candidateId,
          interview_date: interviewDate,
          interview_time: interviewTime,
          interview_notes: notes,
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          job_name: jobName,
          email_sent: true
        });
        
      if (error) {
        throw error;
      }
      
      toast.success('Interview scheduled successfully');
      return true;
    } catch (error: any) {
      console.error('Error scheduling interview:', error.message);
      toast.error('Failed to schedule interview');
      return false;
    }
  },

  uploadResume: async (file: File): Promise<string> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `resumes/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading resume:', error.message);
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
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileType,
          job_id: jobId,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data.id;
    } catch (error: any) {
      console.error('Error creating submission:', error.message);
      toast.error('Failed to create submission');
      throw error;
    }
  },
  
  getSubmissions: async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching submissions:', error.message);
      toast.error('Failed to load submissions');
      return [];
    }
  },
  
  getSubmissionById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching submission:', error.message);
      return null;
    }
  },
  
  getJobApplicationByCvLinkId: async (cvLinkId: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('cv_link_id', cvLinkId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching job application:', error.message);
      return null;
    }
  }
};
