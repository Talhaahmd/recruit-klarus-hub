
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { PlusCircle, Search, List, LayoutGrid, Filter } from 'lucide-react';
import JobCard from '@/components/UI/JobCard';
import { toast } from 'sonner';
import AddJobModal, { NewJobData } from '@/components/UI/AddJobModal';
import JobDetailsModal from '@/components/UI/JobDetailsModal';
import JobsTable from '@/components/UI/JobsTable';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { jobsService, Job } from '@/services/jobsService';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    position: '',
    location: '',
    time: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const data = await jobsService.getJobs();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEdit = (id: string) => {
    toast.info(`Edit job with ID: ${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await jobsService.deleteJob(id);
      if (success) {
        setJobs(jobs.filter(job => job.id !== id));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleView = (job: Job) => {
    setSelectedJob(job);
  };

  const handleAddJob = () => {
    setShowAddModal(true);
  };

  const handleSaveNewJob = async (jobData: NewJobData) => {
    try {
      console.log("Job data being submitted:", jobData);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error('You must be logged in to create a job.');
        return;
      }

      // Ensure correct data mapping to match database fields
      const newJob = await jobsService.createJob({
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        type: jobData.type,
        status: 'Active',
        posted_date: new Date().toISOString().split('T')[0],
        technologies: jobData.technologies,
        workplace_type: jobData.workplaceType,
        complexity: jobData.complexity, // This now uses the validated value
        qualification: jobData.qualification || 'None',
        active_days: jobData.activeDays,
      });

      if (newJob) {
        setJobs([newJob, ...jobs]);
        toast.success('Job created successfully!');
        setShowAddModal(false);
      } else {
        toast.error('Job creation failed. Please check the console for more details.');
      }
    } catch (error: any) {
      console.error('Error creating job:', error);
      toast.error(`Failed to create job: ${error.message || 'Unknown error'}`);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition = filters.position
      ? job.title.toLowerCase().includes(filters.position.toLowerCase())
      : true;

    const matchesLocation = filters.location
      ? job.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    const matchesTime = filters.time
      ? job.posted_date.toLowerCase().includes(filters.time.toLowerCase())
      : true;

    return matchesSearch && matchesPosition && matchesLocation && matchesTime;
  });

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

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Jobs</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Input
                    placeholder="Filter by position"
                    value={filters.position}
                    onChange={(e) => handleFilterChange('position', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="Filter by location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Posted</label>
                  <Input
                    placeholder="Filter by date posted"
                    value={filters.time}
                    onChange={(e) => handleFilterChange('time', e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({ position: '', location: '', time: '' })}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-white' : 'bg-white'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-primary-100 text-white' : 'bg-white'}`}
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>

          <button
            onClick={handleAddJob}
            className="px-4 py-2 bg-primary-100 text-white rounded-lg flex items-center gap-2 hover:bg-primary-100/90 transition-colors shadow-md shadow-primary-100/20"
          >
            <PlusCircle size={18} />
            <span>Add New Job</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary-100 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={() => handleView(job)}
                />
              ))}

              {filteredJobs.length === 0 && (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-text-200">No jobs found matching your search.</p>
                </div>
              )}
            </div>
          ) : (
            <JobsTable
              jobs={filteredJobs}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          )}
        </>
      )}

      <AddJobModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNewJob}
      />

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default Jobs;
