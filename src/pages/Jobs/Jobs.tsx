
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import JobsTable from '@/components/UI/JobsTable';
import AddJobModal from '@/components/UI/JobsComponents/AddJobModal';
import { Job, jobsService } from '@/services/jobsService';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NewJobData } from '@/components/UI/JobsComponents/AddJobModal';

const Jobs = () => {
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const fetchedJobs = await jobsService.getJobs();
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
  };

  const handleSaveJob = async (data: NewJobData) => {
    try {
      // Transform the form data to match JobInput type
      const jobData = {
        title: data.title,
        description: data.description,
        location: data.location,
        type: data.type,
        status: 'Active', // Default status for new jobs
        posted_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        active_days: data.activeDays,
        technologies: data.technologies,
        workplace_type: data.workplaceType,
        applicants: 0 // Default value for new jobs
      };

      console.log('Saving job with data:', jobData);
      const savedJob = await jobsService.createJob(jobData);
      
      if (savedJob) {
        toast.success('Job created successfully');
        fetchJobs(); // Refresh the jobs list after saving
      } else {
        toast.error('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('An error occurred while creating the job');
    } finally {
      setIsAddJobModalOpen(false);
    }
  };

  const handleEditJob = (id: string) => {
    // Implementation for editing a job
    console.log('Edit job:', id);
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
    // Navigate to job details or show a modal with job details
    console.log('View job:', job);
  };

  return (
    <div className="container mx-auto p-4">
      <Header 
        title="Jobs Management" 
        subtitle="Create and manage job postings"
      />
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">All Jobs ({jobs.length})</h2>
          <p className="text-sm text-gray-500">Manage your active and closed job postings</p>
        </div>
        <Button onClick={handleAddJobClick} className="flex items-center gap-2">
          <PlusCircle size={16} />
          Post New Job
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
    </div>
  );
};

export default Jobs;
