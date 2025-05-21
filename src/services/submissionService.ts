
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Submission = {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  status: string;
  job_id: string | null;
  created_at: string;
};

export type JobApplication = {
  id: string;
  cv_link_id: string;
  job_id: string;
  job_name?: string | null;
  created_at: string;
};

export type Interview = {
  id: string;
  candidate_id: string;
  interview_date: string;
  interview_notes?: string;
  email_sent: boolean;
  created_at: string;
};

export type OfferLetter = {
  id: string;
  candidate_id: string;
  document_url?: string;
  document_name?: string;
  email_sent: boolean;
  created_at: string;
};

export const submissionService = {
  // Get all submissions
  getSubmissions: async (): Promise<Submission[]> => {
    try {
      const { data, error } = await supabase
        .from('cv_links')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching submissions:', err.message);
      toast.error('Failed to load submissions');
      return [];
    }
  },

  // Get job application details by cv_link_id
  getJobApplicationByCvLinkId: async (cvLinkId: string): Promise<JobApplication | null> => {
    try {
      console.log("Fetching job application for cv_link_id:", cvLinkId);
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('cv_link_id', cvLinkId)
        .single();
        
      if (error) {
        console.log("Error fetching job application:", error.message);
        if (error.code === 'PGRST116') {
          // No data found
          return null;
        }
        throw error;
      }
      
      console.log("Found job application:", data);
      return data;
    } catch (err: any) {
      console.error('Error fetching job application:', err.message);
      return null;
    }
  },

  // Get submission by id
  getSubmissionById: async (id: string): Promise<Submission | null> => {
    try {
      console.log("Fetching submission for id:", id);
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.log("Error fetching submission:", error.message);
        throw error;
      }
      
      console.log("Found submission:", data);
      return data;
    } catch (err: any) {
      console.error('Error fetching submission:', err.message);
      toast.error('Failed to load submission');
      return null;
    }
  },
  
  // Get all job applications
  getAllJobApplications: async (): Promise<{submission: Submission, jobId: string}[]> => {
    try {
      // First try to get applications from job_applications table
      const { data: jobAppData, error: jobAppError } = await supabase
        .from('job_applications')
        .select('*');
      
      if (jobAppError) {
        console.error("Error fetching job applications:", jobAppError);
        throw jobAppError;
      }
      
      // Also get submissions that might have job_id directly
      const { data: cvData, error: cvError } = await supabase
        .from('cv_links')
        .select('*')
        .not('job_id', 'is', null);
        
      if (cvError) {
        console.error("Error fetching cv links with job_id:", cvError);
        throw cvError;
      }
      
      const result: {submission: Submission, jobId: string}[] = [];
      
      // Process job applications
      if (jobAppData && jobAppData.length > 0) {
        for (const app of jobAppData) {
          const { data: submission } = await supabase
            .from('cv_links')
            .select('*')
            .eq('id', app.cv_link_id)
            .single();
            
          if (submission) {
            result.push({
              submission,
              jobId: app.job_id
            });
          }
        }
      }
      
      // Process direct cv_links with job_id
      if (cvData && cvData.length > 0) {
        for (const cv of cvData) {
          // Check if we already added this submission via job_applications
          const exists = result.some(r => r.submission.id === cv.id);
          if (!exists && cv.job_id) {
            result.push({
              submission: cv,
              jobId: cv.job_id
            });
          }
        }
      }
      
      return result;
    } catch (err: any) {
      console.error('Error fetching all job applications:', err.message);
      return [];
    }
  },

  // Schedule an interview
  scheduleInterview: async (candidateId: string, interviewDate: Date, notes?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('candidate_interviews')
        .insert({
          candidate_id: candidateId,
          interview_date: interviewDate.toISOString(),
          interview_notes: notes || null,
          email_sent: true
        });

      if (error) {
        console.error('Error scheduling interview:', error);
        toast.error('Failed to schedule interview');
        return false;
      }

      toast.success('Interview scheduled successfully');
      return true;
    } catch (err: any) {
      console.error('Error scheduling interview:', err.message);
      toast.error('Failed to schedule interview');
      return false;
    }
  },

  // Send offer letter
  sendOfferLetter: async (candidateId: string, documentUrl?: string, documentName?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('offer_letters')
        .insert({
          candidate_id: candidateId,
          document_url: documentUrl || null,
          document_name: documentName || null,
          email_sent: true
        });

      if (error) {
        console.error('Error sending offer letter:', error);
        toast.error('Failed to send offer letter');
        return false;
      }

      toast.success('Offer letter sent successfully');
      return true;
    } catch (err: any) {
      console.error('Error sending offer letter:', err.message);
      toast.error('Failed to send offer letter');
      return false;
    }
  },

  // Upload offer letter document
  uploadOfferDocument: async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `offer-letters/${fileName}`;

      const { data, error } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err: any) {
      console.error('Error uploading document:', err.message);
      toast.error('Failed to upload document');
      return null;
    }
  },

  // Get interviews by candidate ID
  getInterviewsByCandidateId: async (candidateId: string): Promise<Interview[]> => {
    try {
      const { data, error } = await supabase
        .from('candidate_interviews')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('interview_date', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err: any) {
      console.error('Error fetching interviews:', err.message);
      return [];
    }
  },

  // Get offer letters by candidate ID
  getOfferLettersByCandidateId: async (candidateId: string): Promise<OfferLetter[]> => {
    try {
      const { data, error } = await supabase
        .from('offer_letters')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err: any) {
      console.error('Error fetching offer letters:', err.message);
      return [];
    }
  }
};
