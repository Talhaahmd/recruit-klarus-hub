
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/mufj147gj50vc2ip7sxae5sva9segfpr';

export const newApplicationService = {
  submitApplication: async (
    jobId: string,
    file: File
  ): Promise<boolean> => {
    try {
      console.log('Submitting application for job:', jobId);
      
      // First get job details using public access (no auth required)
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('title, user_id, status')
        .eq('id', jobId)
        .eq('status', 'Active')
        .maybeSingle();

      if (jobError) {
        console.error('Error fetching job:', jobError);
        throw new Error('Unable to find this job posting');
      }

      if (!jobData) {
        throw new Error('This job posting is no longer available or has been deactivated');
      }

      console.log('Job found for application:', jobData.title);

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `applications/${jobId}/${fileName}`;

      console.log('Uploading file to storage:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('cv-bucket')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('File upload error:', uploadError);
        throw new Error('Failed to upload your CV. Please try again.');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cv-bucket')
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;
      console.log('File uploaded successfully:', fileUrl);

      // Insert job application
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          job_name: jobData.title,
          cv_link: fileUrl
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error('Failed to submit your application. Please try again.');
      }

      console.log('Application submitted successfully');

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
            hr_user_id: jobData.user_id
          })
        });
        console.log('Webhook notification sent');
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
