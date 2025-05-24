
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileType, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!jobId) {
          setError('Invalid job ID');
          return;
        }

        const { data, error } = await supabase
          .from('jobs')
          .select('title, description, user_id')
          .eq('id', jobId)
          .single();

        if (error) {
          console.error('Error fetching job:', error);
          setError('Job not found or has been removed');
          return;
        }

        setJob(data);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
      }
    };

    fetchJob();
  }, [jobId]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      validateAndSetFile(selectedFile);
    }
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  // Validate file type and size
  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds maximum limit of 5MB`);
      return;
    }

    // Check file type
    const fileType = selectedFile.type;
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
    
    if (!ALLOWED_FILE_TYPES.includes(fileType) && !ALLOWED_FILE_EXTENSIONS.includes(fileExtension.toLowerCase())) {
      setError('Only PDF, DOC, or DOCX files are allowed');
      return;
    }

    // Set the file if validation passes
    setFile(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobId || !file || !job || !applicantName.trim() || !applicantEmail.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `job_applications/${jobId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);
      
      const fileUrl = urlData.publicUrl;
      
      // Insert into candidate_cvs table
      const { error: insertError } = await supabase
        .from('candidate_cvs')
        .insert({
          job_id: jobId,
          user_id: job.user_id, // Use the job owner's user_id
          applicant_name: applicantName.trim(),
          applicant_email: applicantEmail.trim(),
          cv_file_url: fileUrl,
          cv_file_name: file.name,
          cv_file_size: file.size,
          cv_file_type: file.type,
          status: 'new'
        });
        
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      // Update job applicant count
      await supabase.rpc('increment_job_applicants', { job_id: jobId });
      
      // Show success state
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Link to="/" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
          <p className="mb-6 text-gray-600">
            Thank you for applying to {job?.title}. We've received your application and will be in touch soon.
          </p>
          <Link to="/">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Apply for Job
          </h1>
          
          {job ? (
            <>
              <h2 className="text-xl mb-4 text-gray-700">{job.title}</h2>
              
              {job.description && (
                <div className="mb-6 prose-sm max-w-none text-gray-600 border-b pb-6">
                  <h3 className="text-lg font-medium mb-2">Job Description</h3>
                  <p className="whitespace-pre-line">{job.description}</p>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Submit Your Application</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CV/Resume *
                    </label>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
                        file ? "bg-blue-50 border-blue-300" : ""
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      <input
                        id="file-input"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                      />
                      
                      <div className="flex flex-col items-center justify-center space-y-3">
                        {file ? (
                          <>
                            <FileType className="h-10 w-10 text-blue-500" />
                            <div className="text-sm font-medium">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                              }}
                              className="text-xs mt-2"
                            >
                              Change File
                            </Button>
                          </>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-gray-400" />
                            <div className="text-gray-600">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, DOC or DOCX (max 5MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    disabled={!file || !applicantName.trim() || !applicantEmail.trim() || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                        Uploading...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Apply;
