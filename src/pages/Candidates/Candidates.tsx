import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Layout/MainLayout';
import { PlusCircle, Search, Filter, List, Grid, Mail, Edit, Trash2 } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { candidatesService, Candidate } from '@/services/candidatesService';
import { jobsService, Job } from '@/services/jobsService';

// Sample locations and expertise for filters
const locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Remote"];
const experiences = ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
const expertise = ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker", "CI/CD", "Agile"];

const Candidates: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<string | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [analysisFilter, setAnalysisFilter] = useState<number | null>(null);
  
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [candidatesData, jobsData] = await Promise.all([
          candidatesService.getCandidates(),
          jobsService.getJobs()
        ]);
        
        setCandidates(candidatesData);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching candidates data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getAnalysisColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleLocationChange = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    );
  };
  
  const handleExperienceChange = (exp: string) => {
    setSelectedExperiences(prev => 
      prev.includes(exp) 
        ? prev.filter(e => e !== exp)
        : [...prev, exp]
    );
  };
  
  const handleExpertiseChange = (exp: string) => {
    setSelectedExpertise(prev => 
      prev.includes(exp) 
        ? prev.filter(e => e !== exp)
        : [...prev, exp]
    );
  };
  
  const handleEdit = (id: string) => {
    toast.info(`Edit candidate with ID: ${id}`);
  };
  
  const handleDelete = async (id: string, jobId: string) => {
    try {
      const success = await candidatesService.deleteCandidate(id, jobId);
      if (success) {
        setCandidates(candidates.filter(candidate => candidate.id !== id));
        toast.success(`Candidate removed successfully`);
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };
  
  const handleView = (id: string) => {
    navigate(`/candidates/${id}`);
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
  
  const handleSaveCandidate = async (candidateData: any) => {
    try {
      if (candidateData.type === 'cv') {
        // Upload the resume
        const resumeUrl = await candidatesService.uploadResume(candidateData.file);
        
        if (resumeUrl) {
          // Get the job ID to associate with
          const jobId = selectedJob === 'all' && jobs.length > 0 ? jobs[0].id : selectedJob;
          
          if (!jobId || jobId === 'all') {
            toast.error('Please select a job or create one first');
            return;
          }
          
          const newCandidate = await candidatesService.createCandidate({
            job_id: jobId, // Fixed: Changed jobId to job_id
            name: candidateData.file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            email: `candidate${Date.now()}@example.com`,
            phone: '000-000-0000',
            resume_url: resumeUrl,
            applied_date: new Date().toISOString().split('T')[0],
            status: 'New',
            notes: `Uploaded on ${new Date().toLocaleDateString()}`,
            rating: 3
          });
          
          if (newCandidate) {
            setCandidates([newCandidate, ...candidates]);
          }
        }
      } else if (candidateData.type === 'bulk') {
        // Process CSV bulk upload (simulation)
        const jobId = selectedJob === 'all' && jobs.length > 0 ? jobs[0].id : selectedJob;
        
        if (!jobId || jobId === 'all') {
          toast.error('Please select a job or create one first');
          return;
        }
        
        // For demo purposes, simulate adding 3 candidates
        for (let i = 0; i < 3; i++) {
          const newCandidate = await candidatesService.createCandidate({
            job_id: jobId, // Fixed: Changed jobId to job_id
            name: `Bulk Candidate ${i + 1}`,
            email: `bulk${i + 1}@example.com`,
            phone: `555-000-${i + 1000}`,
            resume_url: '/resumes/bulk-upload.pdf',
            applied_date: new Date().toISOString().split('T')[0],
            status: 'New',
            notes: `Added via bulk upload on ${new Date().toLocaleDateString()}`,
            rating: 3
          });
          
          if (newCandidate) {
            setCandidates(prev => [newCandidate, ...prev]);
          }
        }
      }
      
      setShowAddModal(false);
    } catch (error) {
      console.error('Error processing candidate:', error);
      toast.error('Failed to process candidate');
    }
  };
  
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesJob = selectedJob === 'all' || candidate.job_id === selectedJob; // Fixed: Changed jobId to job_id
    
    // Convert 5-scale rating to 10-scale analysis score
    const analysisScore = candidate.rating * 2;
    
    // Apply additional filters if they are set
    const matchesAnalysis = analysisFilter === null || analysisScore >= analysisFilter;
    
    // In a real app, these would be real properties on the candidate
    // For now, we'll just pass everything since we don't have this data
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes("San Francisco, CA");
    const matchesExperience = selectedExperiences.length === 0;
    const matchesExpertise = selectedExpertise.length === 0;
    
    return matchesSearch && matchesJob && matchesAnalysis && 
           matchesLocation && matchesExperience && matchesExpertise;
  });
  
  const getJobTitle = (jobId: string) => {
    const job = jobs.find(job => job.id === jobId);
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
  
  if (isLoading) {
    return (
      <div>
        <Header 
          title="Candidates" 
          subtitle="Loading candidates data..."
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary-100 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

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
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleTrigger asChild>
              <button className="px-4 py-2 rounded-lg glass border-none flex items-center gap-2">
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 p-4 rounded-lg glass absolute z-10 right-0 w-72">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-2">AI Analysis Score</h3>
                  <div className="flex justify-between">
                    {[2, 4, 6, 8, 10].map(score => (
                      <button
                        key={score}
                        onClick={() => setAnalysisFilter(score === analysisFilter ? null : score)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          score === analysisFilter 
                            ? (score >= 8 
                                ? 'bg-green-500 text-white' 
                                : score >= 5 
                                  ? 'bg-yellow-500 text-white' 
                                  : 'bg-red-500 text-white')
                            : 'bg-gray-100'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Job</h3>
                  <select
                    value={selectedJob}
                    onChange={handleJobFilterChange}
                    className="w-full p-2 rounded-lg glass border-none"
                  >
                    <option value="all">All Jobs</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Location</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {locations.map(location => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`location-${location}`}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={() => handleLocationChange(location)}
                        />
                        <label htmlFor={`location-${location}`} className="text-sm">{location}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Experience</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {experiences.map(exp => (
                      <div key={exp} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`exp-${exp}`}
                          checked={selectedExperiences.includes(exp)}
                          onCheckedChange={() => handleExperienceChange(exp)}
                        />
                        <label htmlFor={`exp-${exp}`} className="text-sm">{exp}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Expertise</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {expertise.map(exp => (
                      <div key={exp} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`expertise-${exp}`}
                          checked={selectedExpertise.includes(exp)}
                          onCheckedChange={() => handleExpertiseChange(exp)}
                        />
                        <label htmlFor={`expertise-${exp}`} className="text-sm">{exp}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedLocations([]);
                    setSelectedExperiences([]);
                    setSelectedExpertise([]);
                    setAnalysisFilter(null);
                    setSelectedJob('all');
                  }}
                  className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Clear All Filters
                </button>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
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
              onDelete={() => handleDelete(candidate.id, candidate.job_id)} // Fixed: Changed jobId to job_id
              onView={handleView}
              onEmail={handleEmail}
              jobTitle={getJobTitle(candidate.job_id)} // Fixed: Changed jobId to job_id
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
                <TableHead>Job</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>AI Analysis</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => {
                  const analysisScore = candidate.rating * 2;
                  return (
                    <TableRow 
                      key={candidate.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleView(candidate.id)}
                    >
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{getJobTitle(candidate.job_id)}</TableCell> {/* Fixed: Changed jobId to job_id */}
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.phone}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getAnalysisColor(analysisScore)}`}>
                          {analysisScore}/10
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEmail(candidate.email);
                            }}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                            title="Email"
                          >
                            <Mail size={16} className="text-gray-500" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(candidate.id);
                            }}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                            title="Edit"
                          >
                            <Edit size={16} className="text-gray-500" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(candidate.id, candidate.job_id); // Fixed: Changed jobId to job_id
                            }}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-gray-500" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
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
