
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import JobsTable from '@/components/UI/JobsTable';
import AddJobModal, { NewJobData } from '@/components/UI/JobsComponents/AddJobModal';
import JobDetailsModal from '@/components/UI/JobDetailsModal';
import { Job } from '@/services/jobsService';
import { PlusCircle, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLinkedInAutoPost } from '@/hooks/useLinkedInAutoPost';
import { useLinkedInPrompt } from '@/hooks/useLinkedInPrompt';
import LinkedInPromptModal from '@/components/UI/LinkedInPromptModal';
import { jobsService } from '@/services/jobsService';

const Jobs = () => {
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingJobData, setPendingJobData] = useState<NewJobData | null>(null);
  const navigate = useNavigate();
  const { autoPostToLinkedIn, isPosting } = useLinkedInAutoPost();
  const { showModal, initiateLinkedInConnect, dismissModal } = useLinkedInPrompt();

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle URL cleanup after LinkedIn callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedInConnected = urlParams.get('linkedin_connected');
    
    if (linkedInConnected === 'true') {
      console.log('LinkedIn connected callback detected, cleaning URL...');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Refresh jobs to show the newly created job
      fetchJobs();
    }
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const fetchedJobs = await jobsService.getJobs();
      console.log('Fetched jobs:', fetchedJobs);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddJobClick = () => {
    setIsAddJobModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddJobModalOpen(false);
    setPendingJobData(null);
  };

  const handleSaveJob = async (data: NewJobData) => {
    console.log('Job data received, prompting for LinkedIn consent...');
    
    // Store the job data and show LinkedIn consent modal
    setPendingJobData(data);
    setIsAddJobModalOpen(false);
    
    // Show LinkedIn consent modal and pass job data to the hook
    dismissModal(); // Reset any existing modal state
    setTimeout(() => {
      initiateLinkedInConnect(data);
    }, 100);
  };

  const handleEditJob = (id: string) => {
    console.log('Edit job:', id);
    // To be implemented
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const success = await jobsService.deleteJob(id);
      if (success) {
        setJobs(jobs.filter(job => job.id !== id));
        toast.success('Job deleted successfully');
      } else {
        toast.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('An error occurred while deleting the job');
    }
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleLinkedInConnect = () => {
    console.log('User confirmed LinkedIn connection');
    if (pendingJobData) {
      initiateLinkedInConnect(pendingJobData);
    } else {
      initiateLinkedInConnect();
    }
  };

  const handleLinkedInDismiss = () => {
    console.log('User dismissed LinkedIn connection');
    dismissModal();
    setPendingJobData(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Header 
        title="Jobs Management" 
        subtitle="Create and manage job postings"
      />

      {/* LinkedIn Connection Info */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            LinkedIn Auto-Posting
          </span>
        </div>
        <p className="text-sm text-blue-700 mt-2">
          When you create a new job, we'll ask for LinkedIn permission to automatically post it to your profile with fresh authorization.
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">All Jobs ({jobs.length})</h2>
          <p className="text-sm text-gray-500">Manage your active and closed job postings</p>
        </div>
        <Button 
          onClick={handleAddJobClick} 
          disabled={isPosting}
          className="flex items-center gap-2 bg-primary-100 hover:bg-primary-100/90"
        >
          {isPosting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Posting to LinkedIn...
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              Post New Job
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
        </div>
      ) : jobs.length > 0 ? (
        <JobsTable 
          jobs={jobs} 
          onEdit={handleEditJob} 
          onDelete={handleDeleteJob} 
          onView={handleViewJob} 
        />
      ) : (
        <div className="glass-card p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No jobs posted yet</h3>
          <p className="text-gray-500 mb-4">Create your first job posting to start receiving applications</p>
          <Button onClick={handleAddJobClick} variant="outline" className="flex items-center gap-2 mx-auto">
            <PlusCircle size={16} />
            Post New Job
          </Button>
        </div>
      )}

      <AddJobModal 
        isOpen={isAddJobModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveJob} 
      />

      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      <LinkedInPromptModal
        isOpen={showModal && pendingJobData !== null}
        onConnect={handleLinkedInConnect}
        onDismiss={handleLinkedInDismiss}
      />
    </div>
  );
};

export default Jobs;
