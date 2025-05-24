
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/mufj147gj50vc2ip7sxae5sva9segfpr';

export const newApplicationService = {
  submitApplication: async (
    jobId: string,
    applicantName: string,
    applicantEmail: string,
    file: File
  ): Promise<boolean> => {
    try {
      // First get job details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('title, hr_user_id')
        .eq('id', jobId)
        .single();

      if (jobError || !jobData) {
        throw new Error('Job not found');
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `applications/${jobId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cv-bucket')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cv-bucket')
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;

      // Insert job application
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          job_name: jobData.title,
          cv_link: fileUrl,
          applicant_name: applicantName,
          applicant_email: applicantEmail
        });

      if (insertError) throw insertError;

      // Call Make.com webhook
      try {
        await fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
          body: JSON.stringify({
            cv_url: fileUrl,
            job_id: jobId,
            job_name: jobData.title,
            hr_user_id: jobData.hr_user_id,
            applicant_name: applicantName,
            applicant_email: applicantEmail
          })
        });
      } catch (webhookError) {
        console.error('Webhook error (non-critical):', webhookError);
      }

      toast.success('Application submitted successfully!');
      return true;
    } catch (err: any) {
      console.error('Error submitting application:', err);
      toast.error(`Application failed: ${err.message}`);
      return false;
    }
  },

  getApplicationsForJob: async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to view applications');
        return [];
      }

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      return [];
    }
  }
};
