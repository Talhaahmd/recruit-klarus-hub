// ✅ Full Updated CandidateProfile.tsx with job_name fetched directly from job_applications

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Briefcase, FileText, Linkedin,
  Calendar, Star, MessageCircle, BookOpen, Building, Award, GraduationCap,
  ArrowLeft
} from 'lucide-react';
import { candidatesService, Candidate } from '@/services/candidatesService';
import { submissionService } from '@/services/submissionService';
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

  const fetchAppliedJob = async (resumeUrl: string) => {
    try {
      const submissionId = extractSubmissionIdFromUrl(resumeUrl);
      if (!submissionId) return;

      const jobApplication = await submissionService.getJobApplicationByCvLinkId(submissionId);

      if (jobApplication?.job_id) {
        setAppliedJob({
          id: jobApplication.job_id,
          title: jobApplication.job_name || 'Unknown Role'
        });
      }
    } catch (error) {
      console.error("Error fetching job application info:", error);
    }
  };

  const extractSubmissionIdFromUrl = (url: string): string | null => {
    try {
      const parts = url.split('/');
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

  const skills = candidate?.skills?.split(',').map(s => s.trim()) || [];
  const companies = candidate?.companies?.split(',').map(c => c.trim()) || [];
  const jobTitles = candidate?.job_titles?.split(',').map(j => j.trim()) || [];
  const degrees = candidate?.degrees?.split(',').map(d => d.trim()) || [];
  const institutions = candidate?.institutions?.split(',').map(i => i.trim()) || [];
  const certifications = candidate?.certifications?.split(',').map(c => c.trim()) || [];

  const renderSkillTags = () => skills.map((skill, index) => (
    <Badge key={index} variant="outline" className="mr-2 mb-2">
      {skill}
    </Badge>
  ));

  return (
    <div className="overflow-auto animate-fade-in">
      <div className="sticky top-0 z-10 bg-background pb-4">
        <Header title="Candidate Profile" subtitle={loading ? "Loading..." : `Viewing profile for ${candidate?.name || 'Unknown'}`} />
        <div className="ml-4 mt-2">
          <Button onClick={handleGoBack} variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Candidates
          </Button>
        </div>
      </div>

      {!loading && candidate && (
        <div className="p-6 bg-background">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold">{candidate.name}</h2>
                  <p className="text-gray-500">{candidate.current_job_title || 'Job Seeker'}</p>

                  {appliedJob && (
                    <div className="mt-3 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Applied Position: <strong>{appliedJob.title}</strong></span>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center"><Mail className="w-4 h-4 mr-2" />{candidate.email}</div>
                    {candidate.phone && <div className="flex items-center"><Phone className="w-4 h-4 mr-2" />{candidate.phone}</div>}
                    {candidate.location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{candidate.location}</div>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap">
                    {renderSkillTags()}
                    {skills.length === 0 && <p className="text-gray-400 italic">No skills listed.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-2/3 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
                  <p className="text-gray-700 whitespace-pre-line">{candidate.ai_summary || 'No summary provided.'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">AI Content</h3>
                  <pre className="text-gray-600 whitespace-pre-line max-h-64 overflow-y-auto">
                    {candidate.ai_content || 'No analysis available.'}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;
