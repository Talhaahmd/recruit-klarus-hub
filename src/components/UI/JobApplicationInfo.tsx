
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
}

const JobApplicationInfo: React.FC<JobApplicationInfoProps> = ({ resumeUrl, candidateId }) => {
  const [job, setJob] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!resumeUrl) return;
      
      try {
        setIsLoading(true);
        
        // Extract the submission ID from URL if possible
        const submissionId = extractSubmissionIdFromUrl(resumeUrl);
        if (!submissionId) return;
        
        // Fetch the submission to get job ID
        const submission = await submissionService.getSubmissionById(submissionId);
        if (!submission?.job_id) {
          // Try getting the job application record
          const jobApplication = await submissionService.getJobApplicationByCvLinkId(submissionId);
          if (jobApplication?.job_id) {
            const jobData = await jobsService.getJobById(jobApplication.job_id);
            setJob(jobData);
          }
          return;
        }
        
        // Fetch the job details
        const jobData = await jobsService.getJobById(submission.job_id);
        setJob(jobData);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [resumeUrl]);

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
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{job.type}</Badge>
                <Badge variant="outline">{job.location}</Badge>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
            className="flex items-center gap-1 text-primary-100"
          >
            <ExternalLink className="h-4 w-4" />
            View Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobApplicationInfo;
