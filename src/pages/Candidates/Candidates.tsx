
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Layout/MainLayout';
import { 
  Search, 
  Mail, 
  Edit, 
  Trash2, 
  List, 
  Grid, 
  Filter, 
  Star,
  MapPin,
  Briefcase,
  X,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import CandidateCard from '@/components/UI/CandidateCard';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { EmailActionsModal } from '@/components/UI/EmailActionsModals';
import { useAuth } from '@/contexts/AuthContext';

// Simplified candidate type that matches the database
type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  current_job_title?: string;
  years_experience?: string;
  ai_rating?: number;
  location?: string;
  timestamp?: string;
  source?: string;
};

const Candidates: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Filter states
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [jobFilter, setJobFilter] = useState<string | null>(null);
  
  // Lists for filter dropdowns
  const [jobsList, setJobsList] = useState<string[]>([]);
  
  // Email modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    console.log('🔍 Auth state check - authenticated:', isAuthenticated, 'loading:', authLoading);
    if (!authLoading) {
      fetchCandidates();
    }
  }, [isAuthenticated, authLoading]);

  // Simplified polling every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Polling for candidates...');
      fetchCandidatesQuietly();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      console.log('📡 Fetching candidates from Supabase...');
      
      // Direct query to candidates table without any RLS checks
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('timestamp', { ascending: false });
        
      console.log('📊 Raw Supabase response:', { data, error, count: data?.length });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        toast.error(`Database error: ${error.message}`);
        return;
      }
      
      if (!data) {
        console.log('⚠️ No data returned from Supabase');
        setCandidates([]);
        return;
      }

      console.log('✅ Successfully fetched candidates:', data.length);
      
      // Transform data to match our frontend expectations
      const transformedCandidates = data.map(candidate => ({
        id: candidate.id,
        full_name: candidate.full_name || 'Unknown',
        email: candidate.email || '',
        phone: candidate.phone,
        linkedin: candidate.linkedin,
        current_job_title: candidate.current_job_title,
        years_experience: candidate.years_experience,
        ai_rating: candidate.ai_rating || 0,
        location: candidate.location,
        timestamp: candidate.timestamp,
        source: candidate.source
      }));

      setCandidates(transformedCandidates);
      
      // Extract unique job titles for filter
      const uniqueJobTitles = [...new Set(
        transformedCandidates
          .map(c => c.current_job_title)
          .filter(Boolean)
      )];
      setJobsList(uniqueJobTitles);
      
    } catch (error: any) {
      console.error("💥 Error fetching candidates:", error);
      toast.error(`Failed to fetch candidates: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Quiet fetch for polling (no loading state changes)
  const fetchCandidatesQuietly = async () => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) {
        console.error('❌ Polling error:', error);
        return;
      }
      
      if (data) {
        const transformedCandidates = data.map(candidate => ({
          id: candidate.id,
          full_name: candidate.full_name || 'Unknown',
          email: candidate.email || '',
          phone: candidate.phone,
          linkedin: candidate.linkedin,
          current_job_title: candidate.current_job_title,
          years_experience: candidate.years_experience,
          ai_rating: candidate.ai_rating || 0,
          location: candidate.location,
          timestamp: candidate.timestamp,
          source: candidate.source
        }));

        setCandidates(transformedCandidates);
      }
    } catch (error) {
      console.error("🔄 Polling error:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEmail = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setEmailModalOpen(true);
  };

  const handleEdit = (id: string) => {
    toast.info(`Edit candidate with ID: ${id}`);
  };

  const handleDelete = async (candidateId: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        const { error } = await supabase
          .from('candidates')
          .delete()
          .eq('id', candidateId);
          
        if (error) {
          console.error('Delete error:', error);
          toast.error('Failed to delete candidate');
          return;
        }
        
        setCandidates(candidates.filter(c => c.id !== candidateId));
        toast.success('Candidate deleted successfully');
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error('Failed to delete candidate');
      }
    }
  };

  const handleView = (id: string) => {
    navigate(`/candidates/${id}`);
  };

  const resetFilters = () => {
    setRatingFilter(null);
    setJobFilter(null);
  };

  const filteredCandidates = candidates.filter(candidate => {
    // Search filter
    const nameMatch = candidate.full_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
    const emailMatch = candidate.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
    const matchesSearch = searchTerm === '' || nameMatch || emailMatch;
    
    // Rating filter
    const matchesRating = ratingFilter === null || (candidate.ai_rating && candidate.ai_rating >= ratingFilter);
    
    // Job filter
    const matchesJob = !jobFilter || candidate.current_job_title === jobFilter;
    
    return matchesSearch && matchesRating && matchesJob;
  });

  const getAnalysisColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const activeFiltersCount = [
    ratingFilter !== null,
    jobFilter !== null,
  ].filter(Boolean).length;

  // Show loading while auth is being checked or candidates are being fetched
  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header
        title="Candidates"
        subtitle="View and manage your candidate pipeline"
      />

      <div className="mb-6 space-y-4">
        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full glass-effect shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <Filter size={16} />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 bg-primary-100">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4 p-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                      <X size={14} className="mr-1" /> Clear
                    </Button>
                  </div>
                  
                  {/* Rating filter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Minimum Rating</label>
                      <span className="text-sm text-gray-500">{ratingFilter !== null ? ratingFilter : 'Any'}</span>
                    </div>
                    <Slider 
                      defaultValue={[0]}
                      max={10}
                      step={1}
                      value={ratingFilter !== null ? [ratingFilter] : [0]}
                      onValueChange={(value) => setRatingFilter(value[0] > 0 ? value[0] : null)}
                      className="py-2"
                    />
                  </div>
                  
                  {/* Job title filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={jobFilter || ''}
                      onChange={(e) => setJobFilter(e.target.value || null)}
                    >
                      <option value="">Any</option>
                      {jobsList.map(job => (
                        <option key={job} value={job}>{job}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="flex gap-2 border rounded-lg overflow-hidden">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? "default" : "ghost"}
                className={`p-2 h-10 w-10 ${viewMode === 'grid' ? 'bg-primary-100 text-white' : ''}`}
                size="icon"
                title="Grid view"
              >
                <Grid size={18} />
              </Button>
              <Button
                onClick={() => setViewMode('table')}
                variant={viewMode === 'table' ? "default" : "ghost"}
                className={`p-2 h-10 w-10 ${viewMode === 'table' ? 'bg-primary-100 text-white' : ''}`}
                size="icon"
                title="Table view"
              >
                <List size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Active filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            {ratingFilter !== null && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Star size={12} /> Rating: {ratingFilter}+
                <button className="ml-1" onClick={() => setRatingFilter(null)}>
                  <X size={12} />
                </button>
              </Badge>
            )}
            {jobFilter && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Briefcase size={12} /> Job: {jobFilter}
                <button className="ml-1" onClick={() => setJobFilter(null)}>
                  <X size={12} />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
          {activeFiltersCount > 0 && ' with applied filters'}
          {candidates.length > 0 && ` (Total: ${candidates.length})`}
        </div>
        <Button 
          onClick={fetchCandidates} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Debug information */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800">Debug Information:</h3>
        <p className="text-sm text-blue-600">
          Candidates in state: {candidates.length}
        </p>
        <p className="text-sm text-blue-600">
          Authentication status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
        </p>
        <p className="text-sm text-blue-600">
          Loading status: {isLoading ? 'Loading' : 'Loaded'}
        </p>
        {candidates.length > 0 && (
          <details className="mt-2">
            <summary className="text-sm text-blue-600 cursor-pointer">Show candidate data</summary>
            <pre className="text-xs bg-white p-2 mt-1 rounded overflow-auto max-h-40">
              {JSON.stringify(candidates.slice(0, 2), null, 2)}
            </pre>
          </details>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={{
                id: candidate.id,
                full_name: candidate.full_name || 'Unknown',
                email: candidate.email || '',
                phone: candidate.phone || '',
                rating: candidate.ai_rating || 0,
                current_job_title: candidate.current_job_title || '',
                skills: '', // Removed skills to avoid issues
                years_experience: candidate.years_experience?.toString() || ''
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={() => handleView(candidate.id)}
              onEmail={() => handleEmail(candidate)}
              jobTitle={candidate.current_job_title || "Candidate"}
            />
          ))}
          {filteredCandidates.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-10">
              <div className="text-4xl mb-4 opacity-30">🔍</div>
              <h3 className="text-lg font-medium mb-2">No candidates found</h3>
              <p className="text-gray-500 mb-6">
                {candidates.length === 0 
                  ? 'No candidates in database yet'
                  : 'Try adjusting your filters or search terms'
                }
              </p>
              {activeFiltersCount > 0 && (
                <Button onClick={resetFilters} variant="outline">Clear filters</Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden sm:table-cell">Job Title</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map(candidate => (
                  <TableRow key={candidate.id} onClick={() => handleView(candidate.id)} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{candidate.full_name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{candidate.phone || '-'}</TableCell>
                    <TableCell className="hidden sm:table-cell">{candidate.current_job_title || '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getAnalysisColor(candidate.ai_rating || 0)}`}>
                        {candidate.ai_rating || 0}/10
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {candidate.source || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <Button size="icon" variant="ghost" onClick={() => handleEmail(candidate)} title="Email">
                          <Mail size={16} className="text-gray-500" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(candidate.id)} title="Edit">
                          <Edit size={16} className="text-gray-500" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(candidate.id)} title="Delete">
                          <Trash2 size={16} className="text-gray-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="text-4xl mb-4 opacity-30">🔍</div>
                    <h3 className="text-lg font-medium mb-2">No candidates found</h3>
                    <p className="text-gray-500 mb-6">
                      {candidates.length === 0 
                        ? 'No candidates in database yet'
                        : 'Try adjusting your filters or search terms'
                      }
                    </p>
                    {activeFiltersCount > 0 && (
                      <Button onClick={resetFilters} variant="outline">Clear filters</Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedCandidate && (
        <EmailActionsModal
          candidateId={selectedCandidate.id}
          candidateName={selectedCandidate.full_name || "Candidate"}
          candidateEmail={selectedCandidate.email}
          jobTitle={selectedCandidate.current_job_title || ""}
          open={emailModalOpen}
          onClose={() => {
            setEmailModalOpen(false);
            setSelectedCandidate(null);
          }}
        />
      )}
    </div>
  );
};

export default Candidates;
