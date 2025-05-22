import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { jobsService } from '@/services/jobsService';
import { Upload, Loader, AlertCircle } from 'lucide-react';
import JobApplicationInfo from '@/components/UI/JobApplicationInfo';
import { EmailActionsModal, InterviewScheduleModal } from '@/components/UI/EmailActionsModals';

const Submission: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchSubmissions();
    fetchJobs();
  }, []);
  
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // RLS will automatically filter to just the user's submissions
      const { data, error } = await supabase
        .from('cv_links')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchJobs = async () => {
    try {
      const fetchedJobs = await jobsService.getJobs();
      setJobs(fetchedJobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const uploadFile = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    
    if (!selectedJobId) {
      toast.error('Please select a job');
      return;
    }
    
    setUploading(true);

    try {
      // Get user information to associate with the upload
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        toast.error('You must be logged in to upload files');
        setUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Find selected job name
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      const jobName = selectedJob ? selectedJob.title : 'Unknown Job';
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('cv')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('cv')
        .getPublicUrl(filePath);
      
      // Create record of CV link
      const { data: cvLinkData, error: cvLinkError } = await supabase
        .from('cv_links')
        .insert([
          {
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_size: file.size,
            file_type: file.type,
            status: 'new',
            job_id: selectedJobId,
            created_by: userId // Set created_by field
          }
        ])
        .select()
        .single();
        
      if (cvLinkError) {
        throw cvLinkError;
      }
      
      // Create job application entry
      const { error: jobAppError } = await supabase
        .from('job_applications')
        .insert([
          {
            cv_link_id: cvLinkData.id,
            job_id: selectedJobId,
            link_for_cv: urlData.publicUrl,
            job_name: jobName,
            created_by: userId // Set created_by field
          }
        ]);
        
      if (jobAppError) {
        throw jobAppError;
      }
      
      toast.success('Resume submitted successfully');
      setFile(null);
      fetchSubmissions();
      
      // Reset the file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };
  
  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };
  
  const handleScheduleInterview = (submission) => {
    setSelectedSubmission(submission);
    setIsInterviewModalOpen(true);
  };
  
  const handleCloseInterviewModal = () => {
    setIsInterviewModalOpen(false);
  };
  
  const handleSendOffer = (submission) => {
    setSelectedSubmission(submission);
    setIsOfferModalOpen(true);
  };
  
  const handleCloseOfferModal = () => {
    setIsOfferModalOpen(false);
  };
  
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">New</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Progress</span>;
      case 'interviewed':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Interviewed</span>;
      case 'hired':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Hired</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };
  
  return (
    <div>
      <Header 
        title="Candidate Submissions" 
        subtitle="Upload and process candidate submissions"
      />
      
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload New Submission</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm mb-2">Select Job Position</label>
            <select 
              className="w-full px-3 py-2 border rounded-md"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
            >
              <option value="">Select a job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-2">Select Resume/CV</label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <Button
              onClick={uploadFile}
              disabled={uploading || !file || !selectedJobId}
              className="w-full flex items-center justify-center gap-2 bg-primary-100 hover:bg-primary-100/90"
            >
              {uploading ? (
                <>
                  <Loader className="animate-spin h-4 w-4" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Upload Submission</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>
        
        {loading ? (
          <div className="text-center py-10">
            <Loader className="animate-spin h-8 w-8 mx-auto text-primary-100" />
            <p className="mt-2 text-sm text-gray-500">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-10">
            <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No submissions found</p>
            <p className="text-sm text-gray-400 mt-1">Upload your first submission above</p>
          </div>
        ) : (
          <div className="divide-y">
            {submissions.map((submission) => (
              <div 
                key={submission.id} 
                className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{submission.file_name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Uploaded {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    {renderStatusBadge(submission.status)}
                  </div>
                </div>
                
                <div className="mt-3 md:mt-0 flex flex-wrap items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(submission.file_url, '_blank')}
                  >
                    View File
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => handleViewSubmission(submission)}
                    className="bg-primary-100 hover:bg-primary-100/90"
                  >
                    Process Submission
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedSubmission && (
        <JobApplicationInfo 
          resumeUrl={selectedSubmission.file_url}
          candidateId={selectedSubmission.id}
        />
      )}
      
      {selectedSubmission && isInterviewModalOpen && (
        <EmailActionsModal
          candidateId={selectedSubmission.id}
          candidateName={selectedSubmission.file_name.split('.')[0] || 'Candidate'}
          candidateEmail="candidate@example.com" // This would need to be populated from real data
          open={isInterviewModalOpen}
          onClose={handleCloseInterviewModal}
          jobTitle="Position Applied For" // This would need to be populated from real data
        />
      )}
    </div>
  );
};

export default Submission;
