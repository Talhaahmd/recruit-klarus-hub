import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, FileText, Linkedin, 
  Calendar, Star, MessageCircle, BookOpen, Building, Award, GraduationCap,
  ArrowLeft, Loader2
} from 'lucide-react';
import { Header } from '@/components/Layout/MainLayout';
import { Badge } from '@/components/UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Button } from '@/components/UI/button';
import { toast } from 'sonner';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/UI/hover-card";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Skeleton } from '@/components/UI/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Simplified candidate type that matches our database
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
  skills?: string;
  certifications?: string;
  companies?: string;
  job_titles?: string;
  degrees?: string;
  institutions?: string;
  graduation_years?: string;
  ai_summary?: string;
  ai_content?: string;
  experience_level?: string;
};

const CandidateProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('details');
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    console.log('🔍 CandidateProfile - Auth state:', { isAuthenticated, authLoading, candidateId: id });
    
    if (!authLoading) {
      if (!isAuthenticated) {
        console.log('❌ User not authenticated, redirecting to login');
        navigate(`/login?from=/candidates/${id}`);
        return;
      }
      
      if (id) {
        fetchCandidate();
      }
    }
  }, [id, isAuthenticated, authLoading, navigate]);

  const fetchCandidate = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      console.log('📡 Fetching candidate with ID:', id);
      
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      console.log('📊 Candidate fetch result:', { data, error });
      
      if (error) {
        console.error('❌ Error fetching candidate:', error);
        toast.error('Failed to load candidate profile');
        return;
      }
      
      if (!data) {
        console.log('⚠️ No candidate found with ID:', id);
        toast.error('Candidate not found');
        return;
      }

      // Transform data to match our component expectations
      const transformedCandidate: Candidate = {
        id: data.id,
        full_name: data.full_name || 'Unknown',
        email: data.email || '',
        phone: data.phone,
        linkedin: data.linkedin,
        current_job_title: data.current_job_title,
        years_experience: data.years_experience,
        ai_rating: data.ai_rating || 0,
        location: data.location,
        timestamp: data.timestamp,
        source: data.source,
        skills: data.skills,
        certifications: data.certifications,
        companies: data.companies,
        job_titles: data.job_titles,
        degrees: data.degrees,
        institutions: data.institutions,
        graduation_years: data.graduation_years,
        ai_summary: data.ai_summary,
        ai_content: data.ai_content,
        experience_level: data.experience_level
      };

      console.log('✅ Successfully loaded candidate:', transformedCandidate.full_name);
      setCandidate(transformedCandidate);
      
    } catch (error: any) {
      console.error("💥 Error fetching candidate:", error);
      toast.error(`Failed to load candidate profile: ${error.message}`);
    } finally {
      setLoading(false);
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

  // Parse arrays from comma-separated strings
  const parseCommaSeparatedString = (str?: string): string[] => {
    return str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];
  };

  const skills = parseCommaSeparatedString(candidate?.skills);
  const companies = parseCommaSeparatedString(candidate?.companies);
  const jobTitles = parseCommaSeparatedString(candidate?.job_titles);
  const degrees = parseCommaSeparatedString(candidate?.degrees);
  const institutions = parseCommaSeparatedString(candidate?.institutions);
  const certifications = parseCommaSeparatedString(candidate?.certifications);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
      </div>
    );
  }

  if (!id) {
    return (
      <div className="p-4 lg:p-8">
        <div className="p-8 text-center">
          <p className="text-lg font-medium">Invalid candidate ID</p>
          <Button onClick={() => navigate('/candidates')} className="mt-4">
            Return to Candidates
          </Button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-4 lg:p-8">
        <div className="p-8 text-center">
          <p className="text-lg font-medium">Candidate not found</p>
          <Button onClick={() => navigate('/candidates')} className="mt-4">
            Return to Candidates
          </Button>
        </div>
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
    <div className="p-4 lg:p-8">
      <div className="overflow-auto animate-fade-in">
        <div className="sticky top-0 z-10 bg-background pb-4">
          <Header 
            title="Candidate Profile" 
            subtitle={`Viewing profile for ${candidate.full_name}`}
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
        
        <div className="p-6 bg-background">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column - Basic info */}
            <div className="w-full md:w-1/3 space-y-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{candidate.full_name}</h2>
                      <p className="text-gray-500">{candidate.current_job_title || 'Job Seeker'}</p>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAnalysisColor(candidate.ai_rating || 0)}`}>
                      {candidate.ai_rating || 0}/10
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                      <Mail className="w-5 h-5 mr-3 text-primary-100" />
                      <a href={`mailto:${candidate.email}`} className="text-primary-100 hover:underline">
                        {candidate.email}
                      </a>
                    </div>
                    
                    {candidate.phone && (
                      <div className="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <Phone className="w-5 h-5 mr-3 text-primary-100" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
                    
                    {candidate.location && (
                      <div className="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <MapPin className="w-5 h-5 mr-3 text-primary-100" />
                        <span>{candidate.location}</span>
                      </div>
                    )}
                    
                    {candidate.linkedin && (
                      <div className="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <Linkedin className="w-5 h-5 mr-3 text-primary-100" />
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
                      <div className="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <Briefcase className="w-5 h-5 mr-3 text-primary-100" />
                        <span>{candidate.years_experience} Years Experience</span>
                      </div>
                    )}
                    
                    {candidate.timestamp && (
                      <div className="flex items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <Calendar className="w-5 h-5 mr-3 text-primary-100" />
                        <span>Added: {new Date(candidate.timestamp).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          (candidate.ai_rating || 0) >= 8 ? 'bg-green-500' :
                          (candidate.ai_rating || 0) >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${((candidate.ai_rating || 0) / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`ml-3 font-medium ${
                      (candidate.ai_rating || 0) >= 8 ? 'text-green-700' :
                      (candidate.ai_rating || 0) >= 5 ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      {candidate.ai_rating || 0}/10
                    </span>
                  </div>
                  <Button
                    onClick={() => setActiveTab('ai')}
                    variant="outline"
                    className="w-full mt-2 gap-2 bg-white hover:bg-gray-50"
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
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger value="details" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <User size={16} /> Profile Details
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <Star size={16} /> AI Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-6 space-y-6">
                  {/* Skills */}
                  {skills.length > 0 && (
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Skills & Expertise</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap">{renderSkillTags()}</div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Work History */}
                  {(jobTitles.length > 0 || companies.length > 0) && (
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Work History</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {jobTitles.length > 0 && (
                            <div className="flex items-start">
                              <Briefcase className="w-5 h-5 mr-3 text-primary-100 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Previous Job Titles</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {jobTitles.map((title, index) => (
                                    <Badge key={index} variant="secondary" className="bg-gray-100">{title}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {companies.length > 0 && (
                            <div className="flex items-start">
                              <Building className="w-5 h-5 mr-3 text-primary-100 mt-0.5" />
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
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Education</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {degrees.length > 0 && (
                            <div className="flex items-start">
                              <GraduationCap className="w-5 h-5 mr-3 text-primary-100 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Degrees</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {degrees.map((degree, index) => (
                                    <Badge key={index} variant="secondary" className="bg-gray-100">{degree}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {institutions.length > 0 && (
                            <div className="flex items-start">
                              <BookOpen className="w-5 h-5 mr-3 text-primary-100 mt-0.5" />
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
                              <Calendar className="w-5 h-5 mr-3 text-primary-100 mt-0.5" />
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
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Certifications</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-start">
                          <Award className="w-5 h-5 mr-3 text-primary-100 mt-0.5" />
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
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Experience Level</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2">
                          <Briefcase className="text-primary-100" size={18} />
                          <span className="text-gray-700">{candidate.experience_level}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="ai" className="mt-6">
                  <Card className="border-none shadow-md overflow-hidden bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Star className="text-primary-100" size={18} />
                          AI Analysis
                        </h3>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className={`flex items-center cursor-help px-3 py-1 rounded-full ${getAnalysisColor(candidate.ai_rating || 0)}`}>
                              <span className="text-lg font-bold">{candidate.ai_rating || 0}</span>
                              <span className="text-sm ml-1">/10</span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80 bg-white">
                            <div className="space-y-2">
                              <h4 className="font-medium">AI Analysis Score Explained</h4>
                              <p className="text-sm text-gray-500">
                                The AI Analysis score evaluates the candidate's fit based on skills, experience, 
                                education, and overall match to job requirements. A score above 7 
                                indicates a strong candidate.
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="space-y-6">
                        {/* AI Summary */}
                        {candidate.ai_summary && (
                          <div className="animate-fade-in">
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
                          <div className="mt-6 animate-fade-in">
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
      </div>
    </div>
  );
};

export default CandidateProfile;
