
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CVSubmission = {
  id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  created_at: string;
  status: "new" | "reviewed" | "contacted" | "rejected";
};

export const submissionService = {
  // Get all CV submissions
  getSubmissions: async (): Promise<CVSubmission[]> => {
    try {
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      const submissions: CVSubmission[] = data.map(submission => ({
        id: submission.id,
        file_name: submission.file_name,
        file_url: submission.file_url,
        file_type: submission.file_type || '',
        file_size: submission.file_size || 0,
        created_at: submission.created_at || new Date().toISOString(),
        status: (submission.status || 'new') as "new" | "reviewed" | "contacted" | "rejected"
      }));
      
      return submissions;
    } catch (err: any) {
      console.error('Error fetching CV submissions:', err.message);
      toast.error('Failed to load CV submissions');
      return [];
    }
  },
  
  // Get a CV submission by ID
  getSubmissionById: async (id: string): Promise<CVSubmission | null> => {
    try {
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      const submission: CVSubmission = {
        id: data.id,
        file_name: data.file_name,
        file_url: data.file_url,
        file_type: data.file_type || '',
        file_size: data.file_size || 0,
        created_at: data.created_at || new Date().toISOString(),
        status: (data.status || 'new') as "new" | "reviewed" | "contacted" | "rejected"
      };
      
      return submission;
    } catch (err: any) {
      console.error('Error fetching CV submission:', err.message);
      toast.error('Failed to load CV submission');
      return null;
    }
  },
  
  // Create a new CV submission
  createSubmission: async (file: File, fileUrl: string): Promise<CVSubmission | null> => {
    try {
      const submission = {
        file_name: file.name,
        file_url: fileUrl,
        file_type: file.type,
        file_size: file.size,
        status: 'new'
      };
      
      const { data, error } = await supabase
        .from('cv_links')
        .insert([submission])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const newSubmission: CVSubmission = {
        id: data.id,
        file_name: data.file_name,
        file_url: data.file_url,
        file_type: data.file_type || '',
        file_size: data.file_size || 0,
        created_at: data.created_at || new Date().toISOString(),
        status: (data.status || 'new') as "new" | "reviewed" | "contacted" | "rejected"
      };
      
      return newSubmission;
    } catch (err: any) {
      console.error('Error creating CV submission:', err.message);
      toast.error('Failed to create CV submission');
      return null;
    }
  },
  
  // Update the status of a CV submission
  updateSubmissionStatus: async (id: string, status: "new" | "reviewed" | "contacted" | "rejected"): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cv_links')
        .update({ status })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success('CV submission status updated');
      return true;
    } catch (err: any) {
      console.error('Error updating CV submission status:', err.message);
      toast.error('Failed to update CV submission status');
      return false;
    }
  },
  
  // Delete a CV submission
  deleteSubmission: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cv_links')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success('CV submission deleted');
      return true;
    } catch (err: any) {
      console.error('Error deleting CV submission:', err.message);
      toast.error('Failed to delete CV submission');
      return false;
    }
  }
};
