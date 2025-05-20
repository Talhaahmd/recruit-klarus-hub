
import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { mockJobs, JobType } from '@/data/mockData';
import { PlusCircle, Search } from 'lucide-react';
import JobCard from '@/components/UI/JobCard';
import { toast } from 'sonner';
import AddJobModal, { NewJobData } from '@/components/UI/AddJobModal';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobType[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleEdit = (id: string) => {
    // In a real app, this would open a modal to edit the job
    toast.info(`Edit job with ID: ${id}`);
  };
  
  const handleDelete = (id: string) => {
    // In a real app, this would show a confirmation modal
    toast.success(`Job deleted successfully`);
    setJobs(jobs.filter(job => job.id !== id));
  };
  
  const handleView = (id: string) => {
    // In a real app, this would navigate to a detailed view
    toast.info(`View job with ID: ${id}`);
  };
  
  const handleAddJob = () => {
    setShowAddModal(true);
  };
  
  const handleSaveNewJob = (jobData: NewJobData) => {
    const newJob: JobType = {
      id: `job-${Date.now()}`,
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      type: jobData.type,
      status: 'Active',
      applicants: 0,
      postedDate: new Date().toLocaleDateString(),
      technologies: jobData.technologies,
      workplaceType: jobData.workplaceType,
      complexity: jobData.complexity,
      qualification: jobData.qualification || 'None',
      activeDays: jobData.activeDays
    };
    
    setJobs([newJob, ...jobs]);
    setShowAddModal(false);
    toast.success('New job added successfully');
  };
  
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header 
        title="Active Jobs" 
        subtitle="Manage all your active job postings."
      />
      
      <div className="mb-6 flex flex-col sm:flex-row items-stretch gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full rounded-lg glass border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        
        <button
          onClick={handleAddJob}
          className="px-4 py-2 bg-primary-100 text-white rounded-lg flex items-center gap-2 hover:bg-primary-100/90 transition-colors shadow-md shadow-primary-100/20"
        >
          <PlusCircle size={18} />
          <span>Add New Job</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
        
        {filteredJobs.length === 0 && (
          <div className="col-span-3 py-12 text-center">
            <p className="text-text-200">No jobs found matching your search.</p>
          </div>
        )}
      </div>

      <AddJobModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNewJob}
      />
    </div>
  );
};

export default Jobs;
