
import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { mockCandidates, mockJobs, CandidateType } from '@/data/mockData';
import { PlusCircle, Search, Filter } from 'lucide-react';
import CandidateCard from '@/components/UI/CandidateCard';
import { toast } from 'sonner';
import AddCandidateModal from '@/components/UI/AddCandidateModal';

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateType[]>(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<string | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleEdit = (id: string) => {
    toast.info(`Edit candidate with ID: ${id}`);
  };
  
  const handleDelete = (id: string) => {
    toast.success(`Candidate removed successfully`);
    setCandidates(candidates.filter(candidate => candidate.id !== id));
  };
  
  const handleView = (id: string) => {
    toast.info(`View candidate profile with ID: ${id}`);
  };
  
  const handleEmail = (email: string) => {
    toast.info(`Send email to: ${email}`);
  };
  
  const handleAddCandidate = () => {
    setShowAddModal(true);
  };
  
  const handleJobFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJob(e.target.value);
  };
  
  const handleSaveCandidate = (candidateData: any) => {
    // In a real app, this would add the candidate to the database
    if (candidateData.type === 'cv') {
      // Process CV file
      const newCandidate: CandidateType = {
        id: `${Date.now()}`,
        jobId: selectedJob === 'all' ? mockJobs[0].id : selectedJob,
        name: 'New Candidate',
        email: 'candidate@example.com',
        phone: '555-000-0000',
        resumeUrl: `/resumes/${candidateData.file.name}`,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'New',
        notes: `Uploaded via CV on ${new Date().toLocaleDateString()}`,
        rating: 3
      };
      
      setCandidates([newCandidate, ...candidates]);
    } else if (candidateData.type === 'bulk') {
      // Process CSV bulk upload (simulation)
      const bulkCandidates: CandidateType[] = Array(3).fill(null).map((_, i) => ({
        id: `${Date.now() + i}`,
        jobId: selectedJob === 'all' ? mockJobs[0].id : selectedJob,
        name: `Bulk Candidate ${i + 1}`,
        email: `bulk${i + 1}@example.com`,
        phone: `555-000-${i + 1000}`,
        resumeUrl: '/resumes/bulk-upload.pdf',
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'New',
        notes: `Added via bulk upload on ${new Date().toLocaleDateString()}`,
        rating: 3
      }));
      
      setCandidates([...bulkCandidates, ...candidates]);
    }
  };
  
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesJob = selectedJob === 'all' || candidate.jobId === selectedJob;
    
    return matchesSearch && matchesJob;
  });
  
  const getJobTitle = (jobId: string) => {
    const job = mockJobs.find(job => job.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  return (
    <div>
      <Header 
        title="Candidates" 
        subtitle="Manage all your job candidates."
      />
      
      <div className="mb-6 flex flex-col sm:flex-row items-stretch gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full rounded-lg glass border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={selectedJob}
              onChange={handleJobFilterChange}
              className="pl-10 pr-4 py-2 rounded-lg glass border-none focus:outline-none focus:ring-2 focus:ring-primary-100 appearance-none bg-transparent"
            >
              <option value="all">All Jobs</option>
              {mockJobs.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <button
            onClick={handleAddCandidate}
            className="px-4 py-2 bg-primary-100 text-white rounded-lg flex items-center gap-2 hover:bg-primary-100/90 transition-colors shadow-md shadow-primary-100/20"
          >
            <PlusCircle size={18} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>
      
      {selectedJob !== 'all' && (
        <div className="mb-6">
          <h2 className="text-lg font-medium">
            Showing candidates for: {getJobTitle(selectedJob)}
          </h2>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onEmail={handleEmail}
          />
        ))}
        
        {filteredCandidates.length === 0 && (
          <div className="col-span-3 py-12 text-center">
            <p className="text-text-200">No candidates found matching your search.</p>
          </div>
        )}
      </div>

      <AddCandidateModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveCandidate}
      />
    </div>
  );
};

export default Candidates;
