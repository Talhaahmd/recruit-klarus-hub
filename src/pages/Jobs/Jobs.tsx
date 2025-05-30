import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/UI/button';
import JobsTable from '@/components/UI/JobsTable';
import AddJobModal from '@/components/UI/JobsComponents/AddJobModal';
import { useAuth } from '@/contexts/AuthContext';
import { Job, jobsService } from '@/services/jobsService';
import { useLinkedInPrompt } from '@/hooks/useLinkedInPrompt';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();
  const { initiateLinkedInConnect, hasLinkedInToken } = useLinkedInPrompt();

  const loadJobs = async () => {
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

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDeleteJob = async (jobId: string) => {
    try {
      await jobsService.deleteJob(jobId);
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleEditJob = (jobId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit job:', jobId);
    toast.info('Edit functionality coming soon');
  };

  const handleViewJob = (job: Job) => {
    // TODO: Implement view functionality
    console.log('View job:', job);
    toast.info('View functionality coming soon');
  };

  const handleAddJob = async (newJobData: any) => {
    if (!user) {
      toast.error('You must be logged in to create jobs');
      return;
    }

    try {
      console.log('Creating job with data:', newJobData);
      
      if (newJobData.postToLinkedIn && !hasLinkedInToken) {
        console.log('LinkedIn posting requested but no token, initiating OAuth...');
        await initiateLinkedInConnect({ 
          callbackSource: 'job_creation',
          postData: newJobData 
        });
        return;
      }

      const jobInput = {
        title: newJobData.title,
        description: newJobData.description,
        location: newJobData.location,
        type: newJobData.type,
        workplace_type: newJobData.workplaceType,
        technologies: newJobData.technologies,
        status: 'Active',
        posted_date: new Date().toISOString().split('T')[0],
        active_days: newJobData.activeDays,
        applicants: 0,
      };

      const createdJob = await jobsService.createJob(jobInput);

      if (createdJob) {
        setJobs([...jobs, createdJob]);
        setShowAddModal(false);
        toast.success('Job created successfully');
        
        // If LinkedIn posting was requested and we have a token, post to LinkedIn
        if (newJobData.postToLinkedIn && hasLinkedInToken) {
          try {
            console.log('Posting job to LinkedIn...');
            const { data: linkedInResponse, error } = await supabase.functions.invoke('auto-linkedin-post', {
              body: { jobId: createdJob.id }
            });

            if (error) {
              console.error('LinkedIn auto-post error:', error);
              toast.error('Job created but LinkedIn posting failed. Please try posting manually.');
            } else if (linkedInResponse?.error) {
              console.error('LinkedIn auto-post failed:', linkedInResponse.error);
              toast.error('Job created but LinkedIn posting failed. Please try posting manually.');
            } else {
              console.log('Job posted to LinkedIn successfully');
              toast.success('Job created and posted to LinkedIn successfully!');
            }
          } catch (linkedInError) {
            console.error('Error posting to LinkedIn:', linkedInError);
            toast.error('Job created but LinkedIn posting failed. Please try posting manually.');
          }
        }
        
        loadJobs();
      } else {
        toast.error('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Button onClick={() => setShowAddModal(true)}><Plus className="mr-2" /> Add Job</Button>
      </div>
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <JobsTable 
          jobs={jobs} 
          onDelete={handleDeleteJob} 
          onEdit={handleEditJob}
          onView={handleViewJob}
        />
      )}
      <AddJobModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSave={handleAddJob} 
      />
    </div>
  );
};

export default Jobs;

