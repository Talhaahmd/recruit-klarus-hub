
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CVSubmission = {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  status: 'new' | 'reviewed' | 'contacted' | 'rejected';
  notes?: string;
  created_at: string;
};

export const submissionService = {
  // Get all CV submissions (for admin use)
  getSubmissions: async (): Promise<CVSubmission[]> => {
    try {
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching CV submissions:', err.message);
      toast.error('Failed to load CV submissions');
      return [];
    }
  },
  
  // Get a submission by ID
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
      
      return data;
    } catch (err: any) {
      console.error('Error fetching CV submission:', err.message);
      toast.error('Failed to load CV submission');
      return null;
    }
  },
  
  // Update a submission status
  updateSubmissionStatus: async (id: string, status: CVSubmission['status'], notes?: string): Promise<CVSubmission | null> => {
    try {
      const updates: any = { status };
      if (notes !== undefined) {
        updates.notes = notes;
      }
      
      const { data, error } = await supabase
        .from('cv_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error updating CV submission:', err.message);
      toast.error('Failed to update CV submission');
      return null;
    }
  },
  
  // Delete a submission
  deleteSubmission: async (id: string): Promise<boolean> => {
    try {
      // First get the submission to get the file path
      const { data: submission, error: fetchError } = await supabase
        .from('cv_links')
        .select('file_url')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (submission && submission.file_url) {
        // Extract file path from the URL
        const fileUrl = new URL(submission.file_url);
        const filePath = fileUrl.pathname.split('/').pop();
        
        if (filePath) {
          // Delete the file from storage
          const { error: storageError } = await supabase
            .storage
            .from('candidate-files')
            .remove([filePath]);
            
          if (storageError) {
            console.error('Error deleting file from storage:', storageError);
          }
        }
      }
      
      // Delete the database entry
      const { error } = await supabase
        .from('cv_links')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err: any) {
      console.error('Error deleting CV submission:', err.message);
      toast.error('Failed to delete CV submission');
      return false;
    }
  }
};
