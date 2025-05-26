
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
      console.log('📧 Inserting interview record:', {
        candidate_id: candidateId,
        interview_date: interviewDateString,
        interview_time: interviewTime,
        interview_notes: interviewNotes,
        candidate_name: candidateName,
        candidate_email: candidateEmail,
        job_name: jobName
      });
      
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
        
      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      console.log('✅ Interview scheduled successfully:', data);
      toast.success('Interview scheduled successfully');
      return data;
    } catch (error: any) {
      console.error('Error scheduling interview:', error);
      toast.error('Failed to schedule interview');
      return null;
    }
  }
};
