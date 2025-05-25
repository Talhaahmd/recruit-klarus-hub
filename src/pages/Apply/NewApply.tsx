
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileType, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { publicJobsService, PublicJob } from '@/services/publicJobsService';
import { newApplicationService } from '@/services/newApplicationService';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx'];

const NewApply: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<PublicJob | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchJob = useCallback(async () => {
    if (!jobId) {
      setError('Invalid job ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Attempting to fetch public job with ID:', jobId);
      
      const jobData = await publicJobsService.getJobById(jobId);
      console.log('Job fetch result:', jobData);
      
      if (!jobData) {
        setError('This job posting is no longer available, has expired, or the link is invalid. Please check with the employer for the latest job postings.');
      } else {
        setJob(jobData);
        console.log('Job loaded successfully:', jobData.title);
      }
    } catch (err: any) {
      console.error('Error fetching job:', err);
      setError('Unable to load job details. This might be a temporary issue. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchJob();
  };

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
    if (!jobId || !file || !job) {
      setError('Please upload your CV to apply');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const success = await newApplicationService.submitApplication(
      jobId,
      file
    );

    if (success) {
      setSuccess(true);
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold mb-2">Unable to Load Job</h2>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{error}</p>
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again {retryCount > 0 && `(${retryCount})`}
                </Button>
                <Link to="/">
                  <Button className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for applying to <strong>{job?.title}</strong>. 
                We'll review your application and get back to you soon.
              </p>
              <Link to="/">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{job?.title}</CardTitle>
              <CardDescription>
                {job?.workplace_type} • {job?.location} • {job?.job_type}
              </CardDescription>
            </CardHeader>
            {job?.description && (
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>
                {job.technologies && job.technologies.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Required Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.technologies.map((tech, index) => (
                        <span 
                          key={index} 
                          className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Application</CardTitle>
            <CardDescription>
              Please upload your resume/CV to apply for this position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
                    file ? "border-green-500 bg-green-50" : ""
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex items-center justify-center space-x-3">
                      <FileType className="w-12 h-12 text-green-500" />
                      <div className="text-left">
                        <p className="font-medium text-green-700 text-lg">{file.name}</p>
                        <p className="text-sm text-green-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Upload Your Resume/CV
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Drag and drop your resume here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, or DOCX files only (max 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="block w-full h-full cursor-pointer"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !file}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewApply;
