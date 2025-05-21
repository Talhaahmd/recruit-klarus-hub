
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, FileText, Linkedin, 
  Calendar, Star, MessageCircle, BookOpen, Building, Award, GraduationCap
} from 'lucide-react';
import { candidatesService, Candidate } from '@/services/candidatesService';
import { submissionService } from '@/services/submissionService';
import { jobsService } from '@/services/jobsService'; 
import { Header } from '@/components/Layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import JobApplicationInfo from '@/components/UI/JobApplicationInfo';
import { ArrowLeft } from 'lucide-react';

const CandidateProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('details');
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [appliedJob, setAppliedJob] = useState<{id: string, title: string} | null>(null);
  
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await candidatesService.getCandidateById(id);
        setCandidate(data);
        
        // Fetch job application info if resume URL exists
        if (data?.resume_url) {
          fetchAppliedJob(data.resume_url);
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
        toast.error("Failed to load candidate profile");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidate();
  }, [id]);

  // Function to fetch job application information
  const fetchAppliedJob = async (resumeUrl: string) => {
    try {
      // Extract submission ID from resume URL
      const submissionId = extractSubmissionIdFromUrl(resumeUrl);
      if (!submissionId) return;
      
      console.log("Found submission ID:", submissionId);
      
      // First check if job_id exists directly in the submission
      const submission = await submissionService.getSubmissionById(submissionId);
      
      if (submission?.job_id) {
        const jobData = await jobsService.getJobById(submission.job_id);
        if (jobData) {
          setAppliedJob({
            id: jobData.id,
            title: jobData.title
          });
          return;
        }
      }
      
      // If not, try to get it from job_applications table
      const jobApplication = await submissionService.getJobApplicationByCvLinkId(submissionId);
      if (jobApplication?.job_id) {
  setAppliedJob({
    id: jobApplication.job_id,
    title: jobApplication.job_name || 'Untitled Job'
  });
}

    } catch (error) {
      console.error("Error fetching job application info:", error);
    }
  };
  
  // Helper function to extract submission ID from URL
  const extractSubmissionIdFromUrl = (url: string): string | null => {
    try {
      const parts = url.split('/');
      // Try to find a UUID pattern in the URL
      for (const part of parts) {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(part)) {
          return part;
        }
      }
      return null;
    } catch (error) {
      console.error('Error extracting submission ID:', error);
      return null;
    }
  };
  
  const handleGoBack = () => {
    navigate('/candidates');
  };

  const getAnalysisColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Parse skills as array 
  const skills = candidate?.skills ? candidate.skills.split(',').map(skill => skill.trim()) : [];

  // Parse previous companies as array
  const companies = candidate?.companies ? candidate.companies.split(',').map(company => company.trim()) : [];

  // Parse job titles as array
  const jobTitles = candidate?.job_titles ? candidate.job_titles.split(',').map(title => title.trim()) : [];

  // Parse degrees as array
  const degrees = candidate?.degrees ? candidate.degrees.split(',').map(degree => degree.trim()) : [];

  // Parse institutions as array
  const institutions = candidate?.institutions ? candidate.institutions.split(',').map(institution => institution.trim()) : [];

  // Parse certifications as array
  const certifications = candidate?.certifications ? candidate.certifications.split(',').map(cert => cert.trim()) : [];

  if (!id) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-medium">Invalid candidate ID</p>
        <Button 
          onClick={() => navigate('/candidates')}
          className="mt-4"
        >
          Return to Candidates
        </Button>
      </div>
    );
  }

  const renderSkillTags = () => {
    return skills.map((skill, index) => (
      <Badge key={index} variant="outline" className="mr-2 mb-2">
        {skill}
      </Badge>
    ));
  };

  return (
    <div className="overflow-auto animate-fade-in">
      <div className="sticky top-0 z-10 bg-background pb-4">
        <Header 
          title="Candidate Profile" 
          subtitle={loading ? "Loading candidate information..." : `Viewing profile for ${candidate?.name || 'Unknown candidate'}`}
        />
        <div className="ml-4 mt-2">
          <Button 
            onClick={handleGoBack}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Candidates</span>
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 bg-background">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column skeleton */}
            <div className="w-full md:w-1/3 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-6" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            </div>
            
            {/* Right column skeleton */}
            <div className="w-full md:w-2/3">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-1/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : candidate ? (
        <div>
  <h2 className="text-2xl font-bold">{candidate.name}</h2>
  <p className="text-gray-500">{candidate.current_job_title || 'Job Seeker'}</p>

  {/* ✅ Show Applied Job Name if available */}
  {appliedJob?.title && (
    <p className="text-sm text-gray-600 mt-1 flex items-center">
      <Briefcase size={14} className="mr-2 text-gray-400" />
      Applied for: <span className="ml-1 font-medium">{appliedJob.title}</span>
    </p>
  )}
</div>

                  {/* Add job application information */}
                  {(candidate.resume_url || appliedJob) && (
                    <div className="mt-4">
                      <JobApplicationInfo 
                        resumeUrl={candidate.resume_url} 
                        candidateId={id}
                        appliedJob={appliedJob}
                      />
                    </div>
                  )}
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-gray-400" />
                      <a href={`mailto:${candidate.email}`} className="text-primary-100 hover:underline">
                        {candidate.email}
                      </a>
                    </div>
                    
                    {candidate.phone && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-3 text-gray-400" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
                    
                    {candidate.location && (
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                        <span>{candidate.location}</span>
                      </div>
                    )}
                    
                    {candidate.linkedin && (
                      <div className="flex items-center">
                        <Linkedin className="w-5 h-5 mr-3 text-gray-400" />
                        <a 
                          href={candidate.linkedin.startsWith('http') ? candidate.linkedin : `https://${candidate.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-100 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    
                    {candidate.years_experience && (
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                        <span>{candidate.years_experience} Years Experience</span>
                      </div>
                    )}
                    
                    {candidate.applied_date && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                        <span>Applied: {new Date(candidate.applied_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Application Status</h3>
                    <span className={`px-2 py-1 text-xs rounded-full 
                      ${candidate.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                        candidate.status === 'Screening' ? 'bg-purple-100 text-purple-800' :
                        candidate.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                        candidate.status === 'Assessment' ? 'bg-orange-100 text-orange-800' :
                        candidate.status === 'Offer' ? 'bg-green-100 text-green-800' :
                        candidate.status === 'Hired' ? 'bg-green-200 text-green-900' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {candidate.status || 'New'}
                    </span>
                  </div>
                  {candidate.applied_date && (
                    <p className="text-sm text-gray-500">
                      Applied on: {new Date(candidate.applied_date).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          candidate.rating >= 8 ? 'bg-green-500' :
                          candidate.rating >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(candidate.rating / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`ml-3 font-medium ${
                      candidate.rating >= 8 ? 'text-green-700' :
                      candidate.rating >= 5 ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      {candidate.rating}/10
                    </span>
                  </div>
                  <Button
                    onClick={() => setActiveTab('ai')}
                    variant="outline"
                    className="w-full mt-2 gap-2"
                  >
                    <FileText size={16} />
                    View AI Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Detailed info */}
            <div className="w-full md:w-2/3">
              <Tabs 
                defaultValue="details"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <User size={16} /> Profile Details
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center gap-2">
                    <Star size={16} /> AI Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-6 space-y-6">
                  {/* Professional Summary */}
                  {candidate.notes && (
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Professional Summary</h3>
                        <p className="text-gray-700">{candidate.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Expertise/Skills */}
                  {skills.length > 0 && (
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Skills & Expertise</h3>
                        <div className="flex flex-wrap">{renderSkillTags()}</div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Work History */}
                  {(jobTitles.length > 0 || companies.length > 0) && (
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Work History</h3>
                        <div className="space-y-4">
                          {jobTitles.length > 0 && (
                            <div className="flex items-start">
                              <Briefcase className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Previous Job Titles</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {jobTitles.map((title, index) => (
                                    <Badge key={index} variant="secondary">{title}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {companies.length > 0 && (
                            <div className="flex items-start">
                              <Building className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Companies</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {companies.map((company, index) => (
                                    <Badge key={index} variant="outline">{company}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Education */}
                  {(degrees.length > 0 || institutions.length > 0) && (
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Education</h3>
                        <div className="space-y-4">
                          {degrees.length > 0 && (
                            <div className="flex items-start">
                              <GraduationCap className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Degrees</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {degrees.map((degree, index) => (
                                    <Badge key={index} variant="secondary">{degree}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {institutions.length > 0 && (
                            <div className="flex items-start">
                              <BookOpen className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Institutions</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {institutions.map((institution, index) => (
                                    <Badge key={index} variant="outline">{institution}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {candidate.graduation_years && (
                            <div className="flex items-start">
                              <Calendar className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Graduation Years</h4>
                                <p className="text-gray-700">{candidate.graduation_years}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                        <div className="flex items-start">
                          <Award className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                          <div className="flex flex-wrap gap-2">
                            {certifications.map((cert, index) => (
                              <Badge key={index} variant="outline">{cert}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Experience Level */}
                  {candidate.experience_level && (
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Experience Level</h3>
                        <div className="flex items-center gap-2">
                          <Briefcase className="text-primary-100" size={18} />
                          <span className="text-gray-700">{candidate.experience_level}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Notes */}
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Notes</h3>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        {candidate.notes ? (
                          <div className="text-gray-700">{candidate.notes}</div>
                        ) : (
                          <div className="text-gray-400 italic">No notes have been added yet.</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="ai" className="mt-6">
                  <Card className="border-none shadow-md overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Star className="text-primary-100" size={18} />
                          AI Analysis
                        </h3>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className={`flex items-center cursor-help px-3 py-1 rounded-full ${getAnalysisColor(candidate.rating)}`}>
                              <span className="text-lg font-bold">{candidate.rating}</span>
                              <span className="text-sm ml-1">/10</span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">AI Analysis Score Explained</h4>
                              <p className="text-sm text-gray-500">
                                The AI Analysis score evaluates the candidate's fit based on skills, experience, 
                                education, and overall match to the job requirements. A score above 7 
                                indicates a strong candidate.
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="space-y-6">
                        {/* AI Summary */}
                        {candidate.ai_summary && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <MessageCircle size={16} className="text-primary-100" />
                              Summary Analysis
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 border">
                              <p className="text-gray-700 whitespace-pre-line">{candidate.ai_summary}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* AI Content (full analysis) */}
                        {candidate.ai_content && (
                          <div className="mt-6">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <FileText size={16} className="text-primary-100" />
                              Detailed Analysis
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 border max-h-96 overflow-y-auto">
                              <pre className="text-gray-700 whitespace-pre-line font-sans">{candidate.ai_content}</pre>
                            </div>
                          </div>
                        )}
                        
                        {/* Placeholder if no AI data */}
                        {!candidate.ai_summary && !candidate.ai_content && (
                          <div className="text-center py-10">
                            <div className="text-4xl mb-4 opacity-30">🤖</div>
                            <h3 className="text-lg font-medium mb-2">No AI analysis available</h3>
                            <p className="text-gray-500 mb-6">This candidate hasn't been analyzed by the AI system yet.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-lg font-medium">Candidate not found</p>
          <Button 
            onClick={() => navigate('/candidates')}
            className="mt-4"
          >
            Return to Candidates
          </Button>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;
