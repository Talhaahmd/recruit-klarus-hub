import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const fileUploadService = {
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
  }
};
