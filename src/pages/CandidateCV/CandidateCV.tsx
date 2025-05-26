import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  FileText, 
  Download, 
  Trash2, 
  Calendar, 
  User, 
  Mail, 
  Filter, 
  Search,
  Eye,
  AlertCircle,
  Phone,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

type CandidateCV = {
  id: string;
  job_id: string;
  user_id: string;
  applicant_name: string;
  applicant_email: string;
  cv_file_url: string;
  cv_file_name: string;
  cv_file_size: number;
  cv_file_type: string;
  application_date: string;
  status: string;
  notes: string;
  jobs: {
    title: string;
    location: string;
    type: string;
  };
};

const CandidateCV: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [cvs, setCvs] = useState<CandidateCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [conductingInterview, setConductingInterview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCandidateCVs();
    }
  }, [user]);

  const fetchCandidateCVs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('candidate_cvs')
        .select(`
          *,
          jobs:job_id (
            title,
            location,
            type
          )
        `)
        .order('application_date', { ascending: false });

      if (error) throw error;
      setCvs(data || []);
    } catch (error) {
      console.error('Error fetching candidate CVs:', error);
      toast.error('Failed to load candidate CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    try {
      const { error } = await supabase
        .from('candidate_cvs')
        .delete()
        .eq('id', cvId);

      if (error) throw error;
      
      setCvs(cvs.filter(cv => cv.id !== cvId));
      toast.success('CV deleted successfully');
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Failed to delete CV');
    }
  };

  const handleStatusUpdate = async (cvId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('candidate_cvs')
        .update({ status: newStatus })
        .eq('id', cvId);

      if (error) throw error;
      
      setCvs(cvs.map(cv => 
        cv.id === cvId ? { ...cv, status: newStatus } : cv
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleConductInterview = async (cv: CandidateCV) => {
    if (!cv.applicant_name) {
      toast.error('Candidate name is required for interview');
      return;
    }

    // For demo purposes, we'll use a placeholder phone number
    // In a real scenario, you'd have the candidate's phone number
    const phoneNumber = '+1234567890'; // This should come from candidate data

    setConductingInterview(cv.id);

    try {
      const response = await fetch('/api/vapi-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'initiate_call',
          candidateId: cv.id,
          candidateName: cv.applicant_name,
          candidatePhone: phoneNumber,
          role: cv.jobs?.title || 'Developer'
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`AI interview initiated for ${cv.applicant_name}`);
      } else {
        throw new Error(result.error || 'Failed to initiate interview');
      }
    } catch (error) {
      console.error('Error conducting interview:', error);
      toast.error('Failed to initiate AI interview');
    } finally {
      setConductingInterview(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'reviewed': return 'bg-yellow-500';
      case 'shortlisted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredCVs = cvs
    .filter(cv => {
      const matchesSearch = 
        cv.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.applicant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.jobs?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || cv.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.application_date).getTime() - new Date(a.application_date).getTime();
        case 'oldest':
          return new Date(a.application_date).getTime() - new Date(b.application_date).getTime();
        case 'name':
          return (a.applicant_name || '').localeCompare(b.applicant_name || '');
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Candidate CVs
          </h1>
          <p className="text-gray-400">
            Manage and review candidate applications for your job postings
          </p>
        </div>

        {/* Filters and Search */}
        <div className="glass-card mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search candidates or jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Filter className="h-4 w-4" />
              {filteredCVs.length} of {cvs.length} CVs
            </div>
          </div>
        </div>

        {/* CV Cards */}
        {filteredCVs.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No CVs Found</h3>
            <p className="text-gray-500">
              {cvs.length === 0 
                ? "No candidates have applied to your jobs yet." 
                : "No CVs match your current filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCVs.map((cv) => (
              <Card key={cv.id} className="glass-card hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2 flex items-center gap-2">
                        <User className="h-5 w-5 text-cyan-400" />
                        {cv.applicant_name || 'Anonymous Applicant'}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Mail className="h-4 w-4" />
                        {cv.applicant_email || 'No email provided'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        Applied {format(new Date(cv.application_date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(cv.status)} text-white`}>
                      {cv.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Job Information */}
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <h4 className="font-medium text-cyan-400 mb-1">Applied for:</h4>
                    <p className="text-white font-semibold">{cv.jobs?.title}</p>
                    <p className="text-gray-400 text-sm">
                      {cv.jobs?.location} • {cv.jobs?.type}
                    </p>
                  </div>

                  {/* CV File Information */}
                  <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                    <FileText className="h-8 w-8 text-purple-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{cv.cv_file_name}</p>
                      <p className="text-gray-400 text-sm">
                        {cv.cv_file_type} • {formatFileSize(cv.cv_file_size)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(cv.cv_file_url, '_blank')}
                        className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = cv.cv_file_url;
                          link.download = cv.cv_file_name;
                          link.click();
                        }}
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleConductInterview(cv)}
                        disabled={conductingInterview === cv.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {conductingInterview === cv.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <Phone className="h-4 w-4 mr-1" />
                            Conduct AI Interview
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Select 
                      value={cv.status} 
                      onValueChange={(value) => handleStatusUpdate(cv.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCV(cv.id)}
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCV;
