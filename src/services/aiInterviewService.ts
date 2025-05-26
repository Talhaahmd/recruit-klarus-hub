
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const aiInterviewService = {
  initiateInterview: async (
    candidateId: string,
    candidateName: string,
    candidatePhone: string,
    role: string = 'Software Developer'
  ) => {
    try {
      console.log('🤖 Initiating AI interview for:', candidateName);
      
      if (!candidatePhone || candidatePhone.trim() === '') {
        toast.error('Candidate phone number is required for AI interviews');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('vapi-interview', {
        body: {
          action: 'initiate_call',
          candidateId,
          candidateName,
          candidatePhone,
          role
        }
      });

      if (error) {
        console.error('❌ Error initiating AI interview:', error);
        toast.error('Failed to initiate AI interview');
        return null;
      }

      console.log('✅ AI interview initiated successfully:', data);
      toast.success(`AI interview call initiated for ${candidateName}`);
      return data;
    } catch (error: any) {
      console.error('💥 Error in AI interview service:', error);
      toast.error(`Failed to initiate AI interview: ${error.message}`);
      return null;
    }
  },

  getInterviewHistory: async (candidateId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_interviews')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching interview history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('💥 Error fetching interview history:', error);
      return [];
    }
  }
};
