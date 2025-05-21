import React from 'react';
import { Candidate } from '@/services/candidatesService';
import { Mail, Phone, Edit, Trash2, MapPin, Star, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { submissionService } from '@/services/submissionService';
import { jobsService } from '@/services/jobsService';

interface CandidateCardProps {
  candidate: Candidate;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEmail: (email: string) => void;
  jobTitle: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  onEdit, 
  onDelete, 
  onView,
  onEmail,
  jobTitle
}) => {
  const [appliedJob, setAppliedJob] = useState<string | null>(null);
  
  useEffect(() => {
    // Try to fetch the job the candidate applied for if resumeUrl exists
    const fetchAppliedJob = async () => {
      if (!candidate.resume_url) return;
      
      try {
        // Extract submission ID from resume URL
        const submissionId = extractSubmissionIdFromUrl(candidate.resume_url);
        if (!submissionId) return;
        
        // First check if job_id exists directly in the submission
        const submission = await submissionService.getSubmissionById(submissionId);
        
        if (submission?.job_id) {
          const jobData = await jobsService.getJobById(submission.job_id);
          if (jobData?.title) {
            setAppliedJob(jobData.title);
            return;
          }
        }
        
        // If not, try to get it from job_applications table
        const jobApplication = await submissionService.getJobApplicationByCvLinkId(submissionId);
        if (jobApplication?.job_id) {
          // First try to use job_name from jobApplication if available
          if (jobApplication.job_name) {
            setAppliedJob(jobApplication.job_name);
            return;
          }
          
          // If job_name is not available, fetch job title from jobs table
          const jobData = await jobsService.getJobById(jobApplication.job_id);
          if (jobData?.title) {
            setAppliedJob(jobData.title);
          }
        }
      } catch (error) {
        console.error("Error fetching job application info:", error);
      }
    };
    
    fetchAppliedJob();
  }, [candidate.resume_url]);
  
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as Element).closest('button')) return;
    onView(candidate.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(candidate.id);
  };

  const getAnalysisColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div 
      className="glass-card p-6 cursor-pointer hover:shadow-md transition-all border-none shadow-sm rounded-lg overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-text-100 truncate max-w-[200px]">{candidate.name || candidate.full_name}</h3>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-text-200 flex items-center gap-1 truncate max-w-[220px]">
              {candidate.current_job_title || jobTitle}
            </p>
            {appliedJob && (
              <div className="flex items-center gap-1 text-xs text-primary-100">
                <Briefcase size={12} />
                <span className="truncate max-w-[200px] font-medium">Applied for: {appliedJob}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onEmail(candidate.email);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Email"
          >
            <Mail size={15} className="text-gray-500" />
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(candidate.id);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
          >
            <Edit size={15} className="text-gray-500" />
          </Button>
          <Button 
            onClick={handleDelete}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Delete"
          >
            <Trash2 size={15} className="text-gray-500" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1.5 text-sm text-text-200">
          <Mail size={14} className="text-gray-400" />
          <span className="truncate max-w-[250px]">{candidate.email}</span>
        </div>
        
        {candidate.phone && (
          <div className="flex items-center gap-1.5 text-sm text-text-200">
            <Phone size={14} className="text-gray-400" />
            <span>{candidate.phone}</span>
          </div>
        )}
        
        {candidate.location && (
          <div className="flex items-center gap-1.5 text-sm text-text-200">
            <MapPin size={14} className="text-gray-400" />
            <span>{candidate.location}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1.5 text-sm mt-3">
          <div className={`${getAnalysisColor(candidate.rating)} px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1`}>
            <Star size={12} /> {candidate.rating}/10
          </div>
          
          {candidate.applied_date && (
            <span className="text-xs text-gray-500 ml-auto">
              Applied: {new Date(candidate.applied_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
