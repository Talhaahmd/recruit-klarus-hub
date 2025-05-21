
import React, { useState, useEffect } from 'react';
import { Briefcase, ExternalLink } from 'lucide-react';
import { jobsService } from '@/services/jobsService';
import { submissionService } from '@/services/submissionService';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface JobApplicationInfoProps {
  resumeUrl?: string | null;
  candidateId?: string;
  appliedJob?: {id: string, title: string} | null;
}

const JobApplicationInfo: React.FC<JobApplicationInfoProps> = ({ resumeUrl, candidateId, appliedJob }) => {
  const [job, setJob] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If appliedJob is already provided, use it directly
    if (appliedJob) {
      setJob(appliedJob);
      return;
    }
    
    const fetchJobDetails = async () => {
      if (!resumeUrl) return;
      
      try {
        setIsLoading(true);
        
        // Extract the submission ID from URL if possible
        const submissionId = extractSubmissionIdFromUrl(resumeUrl);
        if (!submissionId) return;
        
        console.log("Found submission ID:", submissionId);
        
        // Fetch the submission to get job ID
        const submission = await submissionService.getSubmissionById(submissionId);
        console.log("Submission data:", submission);
        
        if (submission?.job_id) {
          console.log("Found job_id in submission:", submission.job_id);
          const jobData = await jobsService.getJobById(submission.job_id);
          console.log("Job data from submission.job_id:", jobData);
          if (jobData) {
            setJob(jobData);
            return;
          }
        }
        
        // Try getting the job application record if submission doesn't have job_id
        const jobApplication = await submissionService.getJobApplicationByCvLinkId(submissionId);
        console.log("Job application data:", jobApplication);
        
        if (jobApplication?.job_id) {
          console.log("Found job_id in job_application:", jobApplication.job_id);
          const jobData = await jobsService.getJobById(jobApplication.job_id);
          console.log("Job data from job_application.job_id:", jobData);
          if (jobData) {
            setJob(jobData);
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [resumeUrl, appliedJob]);

  // Helper function to extract submission ID from URL
  const extractSubmissionIdFromUrl = (url: string): string | null => {
    try {
      // This is a simplified extraction - adjust based on your actual URL structure
      const parts = url.split('/');
      // Try to find a UUID pattern in the URL
      for (const part of parts) {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(part)) {
          return part;
        }
      }
      return null;
    } catch (error) {
      console.error('Error extracting submission ID:', error);
      return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <Card className="mb-4 border-l-4 border-l-primary-100">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-md font-medium flex items-center gap-2 mb-1">
              <Briefcase className="h-4 w-4 text-primary-100" />
              Applied For
            </h3>
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{job.title}</span>
              {job.type && job.location && (
                <div className="flex items-center gap-2 mt-1">
                  {job.type && <Badge variant="outline">{job.type}</Badge>}
                  {job.location && <Badge variant="outline">{job.location}</Badge>}
                </div>
              )}
            </div>
          </div>
          
          {job.id && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
              className="flex items-center gap-1 text-primary-100"
            >
              <ExternalLink className="h-4 w-4" />
              View Job
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobApplicationInfo;
