
import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { mockCandidates, mockJobs, CandidateType } from '@/data/mockData';
import { PlusCircle, Search, Filter, List, Grid } from 'lucide-react';
import CandidateCard from '@/components/UI/CandidateCard';
import { toast } from 'sonner';
import AddCandidateModal from '@/components/UI/AddCandidateModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateType[]>(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<string | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Screening': return 'bg-purple-100 text-purple-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Assessment': return 'bg-orange-100 text-orange-800';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Hired': return 'bg-green-200 text-green-900';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          
          <div className="flex gap-2 border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-white' : 'bg-white'}`}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-primary-100 text-white' : 'bg-white'}`}
              title="Table view"
            >
              <List size={18} />
            </button>
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
      
      {viewMode === 'grid' ? (
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
      ) : (
        <div className="glass-card overflow-hidden rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </TableCell>
                    <TableCell>{getJobTitle(candidate.jobId)}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.phone}</TableCell>
                    <TableCell>{candidate.appliedDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleView(candidate.id)}
                          className="p-1.5 rounded-full hover:bg-gray-100"
                          title="View Profile"
                        >
                          <Search size={16} className="text-primary-100" />
                        </button>
                        <button 
                          onClick={() => handleEmail(candidate.email)}
                          className="p-1.5 rounded-full hover:bg-gray-100"
                          title="Email"
                        >
                          <PlusCircle size={16} className="text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleEdit(candidate.id)}
                          className="p-1.5 rounded-full hover:bg-gray-100"
                          title="Edit"
                        >
                          <Filter size={16} className="text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleDelete(candidate.id)}
                          className="p-1.5 rounded-full hover:bg-gray-100"
                          title="Delete"
                        >
                          <PlusCircle size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No candidates found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AddCandidateModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveCandidate}
      />
    </div>
  );
};

export default Candidates;
