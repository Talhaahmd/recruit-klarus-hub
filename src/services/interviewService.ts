
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const interviewService = {
  scheduleInterview: async (
    candidateId: string,
    interviewDateString: string,
    interviewTime: string = '',
    interviewNotes: string = '',
    candidateName: string = '',
    candidateEmail: string = '',
    jobName: string = ''
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to schedule an interview');
        return null;
      }
      
      const { data, error } = await supabase
        .from('candidate_interviews')
        .insert({
          candidate_id: candidateId,
          interview_date: interviewDateString,
          interview_time: interviewTime,
          interview_notes: interviewNotes,
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          job_name: jobName
        })
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
