
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CVSubmission = {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  status: 'new' | 'reviewed' | 'contacted' | 'rejected' | string;
  created_at: string;
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
      
      // Type assertion to ensure the data matches our CVSubmission type
      return data as CVSubmission[];
    } catch (err: any) {
      console.error('Error fetching CV submissions:', err.message);
      toast.error('Failed to load CV submissions');
      return [];
    }
  },
  
  // Get a single submission by ID
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
      
      // Type assertion to match our CVSubmission type
      return data as CVSubmission;
    } catch (err: any) {
      console.error('Error fetching CV submission:', err.message);
      toast.error('Failed to load CV submission');
      return null;
    }
  },
  
  // Update a CV submission status
  updateSubmissionStatus: async (id: string, status: string): Promise<CVSubmission | null> => {
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
      // Type assertion to match our CVSubmission type
      return data as CVSubmission;
    } catch (err: any) {
      console.error('Error updating CV submission:', err.message);
      toast.error('Failed to update submission status');
      return null;
    }
  },
  
  // Delete a CV submission
  deleteSubmission: async (id: string): Promise<boolean> => {
    try {
      // First get the file path
      const { data: submission } = await supabase
        .from('cv_links')
        .select('file_url')
        .eq('id', id)
        .single();
      
      if (submission) {
        // Try to extract the file path from the URL
        const url = new URL(submission.file_url);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/candidate-files\/(.+)$/);
        
        if (pathMatch && pathMatch[1]) {
          const filePath = pathMatch[1];
          // Delete the file from storage
          await supabase.storage.from('candidate-files').remove([filePath]);
        }
      }
      
      // Delete the database record
      const { error } = await supabase
        .from('cv_links')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success('CV submission deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting CV submission:', err.message);
      toast.error('Failed to delete CV submission');
      return false;
    }
  }
};
