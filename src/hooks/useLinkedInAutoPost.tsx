
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useLinkedInAutoPost = () => {
  const [isPosting, setIsPosting] = useState(false);

  const autoPostToLinkedIn = async (jobId: string) => {
    setIsPosting(true);
    
    try {
      console.log('Initiating auto LinkedIn post for job:', jobId);
      
      const { data, error } = await supabase.functions.invoke('auto-linkedin-post', {
        body: { jobId }
      });

      if (error) {
        console.error('LinkedIn auto-post error:', error);
        toast.error(`LinkedIn posting failed: ${error.message}`);
        return false;
      }

      if (data?.error) {
        console.error('LinkedIn auto-post failed:', data.error);
        toast.error(`LinkedIn posting failed: ${data.error}`);
        return false;
      }

      console.log('LinkedIn auto-post successful:', data);
      toast.success('Job posted to LinkedIn successfully!');
      return true;
    } catch (error) {
      console.error('Unexpected error in LinkedIn auto-post:', error);
      toast.error('Failed to post to LinkedIn. Please try again.');
      return false;
    } finally {
      setIsPosting(false);
    }
  };

  return {
    autoPostToLinkedIn,
    isPosting
  };
};
