// pages/Apply.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileType, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx'];

const Apply: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<{ title: string; description: string; user_id: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return setError('Invalid job ID');
      const { data, error } = await supabase
        .from('jobs')
        .select('title, description, user_id')
        .eq('id', jobId)
        .single();
      if (error || !data) return setError('Job not found or has been removed');
      setJob(data);
    };
    fetchJob();
  }, [jobId]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const fileExt = selectedFile.name.split('.').pop();
    if (selectedFile.size > MAX_FILE_SIZE) return setError(`File size exceeds maximum limit of 5MB`);
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type) && !ALLOWED_FILE_EXTENSIONS.includes(`.${fileExt?.toLowerCase()}`)) {
      return setError('Only PDF, DOC, or DOCX files are allowed');
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId || !file || !job || !applicantName.trim() || !applicantEmail.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `job_applications/${jobId}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('candidate-files').upload(filePath, file, {
        cacheControl: '3600', upsert: false
      });
      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage.from('candidate-files').getPublicUrl(filePath);
      const fileUrl = urlData.publicUrl;

      const { error: insertError } = await supabase.from('candidate_cvs').insert({
        job_id: jobId,
        user_id: job.user_id,
        applicant_name: applicantName.trim(),
        applicant_email: applicantEmail.trim(),
        cv_file_url: fileUrl,
        cv_file_name: file.name,
        cv_file_size: file.size,
        cv_file_type: file.type,
        status: 'new'
      });
      if (insertError) throw new Error(insertError.message);

      const res = await fetch("https://bzddkmmjqwgylckimwiq.functions.supabase.co/candidate-cv-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv_url: fileUrl,
          job_id: jobId,
          job_name: job.title,
          created_by: job.user_id
        })
      });

      const result = await res.json();
      console.log("💬 Edge function result:", result);

      await supabase.rpc('increment_job_applicants', { job_id: jobId });
      setSuccess(true);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to submit application');
      toast.error(`Application failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return <div>... [RENDERING SECTION OMITTED FOR BREVITY] ...</div>;
};

export default Apply;
