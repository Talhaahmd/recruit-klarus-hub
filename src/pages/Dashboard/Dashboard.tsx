import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  ArrowUpRight,
  Loader2,
  Upload,
  LinkedinIcon,
  Building,
  UserCircle,
  Users2,
  Plus,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobsService } from '@/services/jobsService';
import { candidatesService } from '@/services/candidatesService';
import { linkedinProfileService, LinkedInProfile } from '@/services/linkedinProfileService';
import { Job } from '@/services/jobsService';
import { Candidate } from '@/services/candidatesService';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/UI/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { linkedinEnhancedService } from '@/services/linkedinEnhancedService';
import { linkedinAuthService } from '@/services/linkedinAuthService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [linkedinProfile, setLinkedinProfile] = useState<LinkedInProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [isLoadingAds, setIsLoadingAds] = useState(false);
  const [needsReconnect, setNeedsReconnect] = useState(false);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const [jobsData, candidatesData, profileData] = await Promise.all([
          jobsService.getJobs(),
          candidatesService.getCandidates(),
          linkedinProfileService.getProfile()
        ]);
        
        console.log('Fetched jobs:', jobsData);
        setJobs(jobsData);
        setCandidates(candidatesData);
        setLinkedinProfile(profileData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (!user) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, navigate, user]);
  
  useEffect(() => {
    const fetchLinkedInData = async () => {
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, skipping LinkedIn data fetch');
        return;
      }

      if (linkedinProfile) {
        setIsLoadingOrgs(true);
        setIsLoadingAds(true);
        try {
          const orgsData = await linkedinEnhancedService.getOrganizationData();
          if (orgsData) {
            setOrganizations(orgsData);
          }

          const adsData = await linkedinEnhancedService.getAdvertisingAccounts();
          if (adsData) {
            setAdAccounts(adsData);
          }
        } catch (error) {
          console.error('Error fetching LinkedIn data:', error);
          if (error instanceof Error && error.message.includes('Failed to fetch')) {
            setNeedsReconnect(true);
          }
          // If authentication error, redirect to login
          if (error instanceof Error && error.message.includes('not authenticated')) {
            navigate('/login');
          }
        } finally {
          setIsLoadingOrgs(false);
          setIsLoadingAds(false);
        }
      }
    };

    fetchLinkedInData();
  }, [linkedinProfile, isAuthenticated, user, navigate]);
  
  // Calculate statistics
  const activeJobs = jobs.filter(job => job.status === 'Active').length;
  const totalCandidates = candidates.length;
  const interviewScheduled = candidates.filter(c => c.status === 'Interview').length;
  
  // Calculate hiring funnel data
  const newCandidates = candidates.filter(c => c.status === 'New').length;
  const screeningCandidates = candidates.filter(c => c.status === 'Screening').length;
  const interviewCandidates = interviewScheduled;
  const assessmentCandidates = candidates.filter(c => c.status === 'Assessment').length;
  const offerCandidates = candidates.filter(c => c.status === 'Offer').length;
  const hiredCandidates = candidates.filter(c => c.status === 'Hired').length;
  
  const statCards = [
    {
      title: 'Active Jobs',
      value: activeJobs,
      icon: Briefcase,
      color: 'bg-primary-100',
      link: '/jobs'
    },
    {
      title: 'Total Candidates',
      value: totalCandidates,
      icon: Users,
      color: 'bg-accent-100',
      link: '/candidates'
    },
    {
      title: 'Interviews Scheduled',
      value: interviewScheduled,
      icon: Calendar,
      color: 'bg-amber-500',
      link: '/calendar'
    },
    {
      title: 'Conversion Rate',
      value: totalCandidates ? `${Math.round((hiredCandidates / totalCandidates) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      link: '/candidates'
    }
  ];
  
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime())
    .slice(0, 3);
  
  const createTestProfile = async () => {
    setIsCreatingProfile(true);
    try {
      const testProfile = {
        full_name: "John Developer",
        profile_image: "https://picsum.photos/200",
        header_image: "https://picsum.photos/800/200",
        headline: "Senior Software Engineer | Full Stack Developer | React & Node.js Expert",
        current_position: "Senior Software Engineer",
        company: "Tech Innovations Inc.",
        bio: "Passionate about building scalable web applications and mentoring junior developers. Experienced in React, Node.js, and cloud technologies.",
        follower_count: 1500,
        connection_count: 500,
        profile_url: "https://linkedin.com/in/johndeveloper"
      };

      const updatedProfile = await linkedinProfileService.updateProfile(testProfile);
      if (updatedProfile) {
        setLinkedinProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error creating test profile:', error);
    } finally {
      setIsCreatingProfile(false);
    }
  };
  
  const handleReconnectLinkedIn = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    try {
      await linkedinAuthService.signInWithLinkedIn();
    } catch (error) {
      console.error('Error reconnecting LinkedIn:', error);
      toast.error('Failed to reconnect LinkedIn. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-100 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's an overview of your hiring activities."
      />
      
      {/* LinkedIn Profile Section */}
      <div className="mb-8 px-4 lg:px-0">
        <div className="glass-card overflow-hidden">
          {!linkedinProfile && !isLoading && (
            <div className="p-6 flex flex-col items-center justify-center">
              <UserCircle className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No LinkedIn profile found</p>
              <Button
                onClick={createTestProfile}
                disabled={isCreatingProfile}
                className="flex items-center gap-2"
              >
                {isCreatingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Create Test Profile
              </Button>
            </div>
          )}
          
          {linkedinProfile && (
            <>
              {/* Header Image */}
              <div 
                className="w-full h-32 lg:h-48 bg-cover bg-center"
                style={{ 
                  backgroundImage: linkedinProfile.header_image 
                    ? `url(${linkedinProfile.header_image})` 
                    : 'linear-gradient(to right, #0077B5, #00A0DC)' 
                }}
              />
              
              {/* Profile Content */}
              <div className="p-4 lg:p-6 relative">
                {/* Profile Image */}
                <div className="absolute -top-16 left-6">
                  <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-900 shadow-lg">
                    <AvatarImage src={linkedinProfile.profile_image} />
                    <AvatarFallback>
                      <UserCircle className="w-24 h-24" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Profile Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-text-100 dark:text-white">
                      {linkedinProfile.full_name || 'Your Name'}
                    </h2>
                    <p className="text-text-200 dark:text-gray-400 mt-1">
                      {linkedinProfile.headline || 'Your Headline'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleReconnectLinkedIn}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <LinkedinIcon className="h-4 w-4 text-[#0077B5]" />
                      <span className="hidden sm:inline">Refresh Token</span>
                    </Button>
                    <a 
                      href={linkedinProfile.profile_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#0077B5] hover:underline"
                    >
                      <LinkedinIcon size={20} />
                      <span className="hidden lg:inline">View Profile</span>
                    </a>
                  </div>
                </div>
                
                {/* Current Position */}
                <div className="flex items-center gap-2 mt-4 text-text-200 dark:text-gray-400">
                  <Building size={16} />
                  <span>{linkedinProfile.current_position || 'Position'}</span>
                  <span>at</span>
                  <span className="font-medium text-text-100 dark:text-white">
                    {linkedinProfile.company || 'Company'}
                  </span>
                </div>
                
                {/* Bio */}
                <p className="mt-4 text-text-200 dark:text-gray-400">
                  {linkedinProfile.bio || 'Your professional bio will appear here.'}
                </p>
                
                {/* Profile Analysis */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Profile Strength */}
                  <Card className="bg-white dark:bg-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-100" />
                        Profile Strength
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-primary-100 rounded-full transition-all"
                              style={{ width: `${linkedinProfile.profile_strength_score || 0}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-medium">{linkedinProfile.profile_strength_score || 0}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Network Score */}
                  <Card className="bg-white dark:bg-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users2 className="w-5 h-5 text-primary-100" />
                        Network Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-primary-100 rounded-full transition-all"
                              style={{ width: `${linkedinProfile.network_score || 0}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-medium">{linkedinProfile.network_score || 0}%</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                        <span>{linkedinProfile.connection_count || 0} connections</span>
                        <span>{linkedinProfile.follower_count || 0} followers</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Engagement Score */}
                  <Card className="bg-white dark:bg-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-100" />
                        Engagement Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-primary-100 rounded-full transition-all"
                              style={{ width: `${linkedinProfile.engagement_score || 0}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-medium">{linkedinProfile.engagement_score || 0}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Analysis */}
                {linkedinProfile.ai_insights && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">AI Analysis & Insights</h3>
                    
                    {/* Summary */}
                    <Card className="bg-white dark:bg-gray-800 mb-6">
                      <CardContent className="p-6">
                        <p className="text-gray-600 dark:text-gray-300">
                          {linkedinProfile.ai_summary}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Detailed Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-white dark:bg-gray-800">
                        <CardHeader>
                          <CardTitle>Career Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Career Trajectory</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {linkedinProfile.ai_insights.careerTrajectory}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Skills Assessment</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {linkedinProfile.ai_insights.skillsAssessment}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-gray-800">
                        <CardHeader>
                          <CardTitle>Network Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Network Analysis</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {linkedinProfile.ai_insights.networkAnalysis}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Industry Position</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {linkedinProfile.ai_insights.industryPosition}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Suggestions */}
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">Improvement Suggestions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white dark:bg-gray-800">
                          <CardHeader>
                            <CardTitle>Profile & Content</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {linkedinProfile.ai_suggestions.profile.map((suggestion, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-5 h-5 text-primary-100 mt-0.5" />
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion}</p>
                                </div>
                              ))}
                              {linkedinProfile.ai_suggestions.content.map((suggestion, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-5 h-5 text-primary-100 mt-0.5" />
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-gray-800">
                          <CardHeader>
                            <CardTitle>Skills & Networking</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {linkedinProfile.ai_suggestions.skills.map((suggestion, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-5 h-5 text-primary-100 mt-0.5" />
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion}</p>
                                </div>
                              ))}
                              {linkedinProfile.ai_suggestions.networking.map((suggestion, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-5 h-5 text-primary-100 mt-0.5" />
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analyze Button */}
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={async () => {
                      try {
                        const analysis = await linkedinProfileService.analyzeProfile();
                        if (analysis) {
                          // Refresh the profile data to show new analysis
                          const updatedProfile = await linkedinProfileService.getProfile();
                          if (updatedProfile) {
                            setLinkedinProfile(updatedProfile);
                          }
                        }
                      } catch (error) {
                        console.error('Error analyzing profile:', error);
                      }
                    }}
                    className="flex items-center gap-2"
                    disabled={isCreatingProfile}
                  >
                    {isCreatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Activity className="w-4 h-4" />
                    )}
                    {linkedinProfile.ai_insights ? 'Refresh Analysis' : 'Analyze Profile'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex justify-end mb-6 px-4 lg:px-0">
        <Button 
          onClick={() => navigate('/cv-upload')}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm lg:text-base"
        >
          <Upload size={16} />
          Upload CV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8 px-4 lg:px-0">
        {statCards.map((card, index) => (
          <div 
            key={index}
            onClick={() => navigate(card.link)}
            className="glass-card p-4 lg:p-6 cursor-pointer hover:translate-y-[-2px] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2 lg:p-3 rounded-lg ${card.color}`}>
                <card.icon className="text-white" size={18} />
              </div>
              <ArrowUpRight size={16} className="text-gray-400" />
            </div>
            <div className="text-xl lg:text-2xl font-bold text-text-100 dark:text-white">{card.value}</div>
            <div className="text-xs lg:text-sm text-text-200 dark:text-gray-400">{card.title}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 px-4 lg:px-0">
        <div className="glass-card p-4 lg:p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-text-100 dark:text-white mb-4">Hiring Funnel</h2>
          <div className="space-y-4 lg:space-y-5">
            {[
              { label: 'New Applications', count: newCandidates, color: 'bg-primary-100' },
              { label: 'Screening', count: screeningCandidates, color: 'bg-blue-500' },
              { label: 'Interview', count: interviewCandidates, color: 'bg-amber-500' },
              { label: 'Assessment', count: assessmentCandidates, color: 'bg-purple-500' },
              { label: 'Offer', count: offerCandidates, color: 'bg-orange-500' },
              { label: 'Hired', count: hiredCandidates, color: 'bg-green-500' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="dark:text-gray-300">{item.label}</span>
                  <span className="font-medium dark:text-white">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: totalCandidates ? `${(item.count / totalCandidates) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-4 lg:p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-text-100 dark:text-white mb-4">Recent Job Postings</h2>
          {recentJobs.length > 0 ? (
            <div className="space-y-4 lg:space-y-5">
              {recentJobs.map(job => (
                <div 
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="p-3 lg:p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-primary-100 dark:text-blue-400 text-sm lg:text-base">{job.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 flex items-center gap-1">
                      <CheckCircle size={10} />
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs lg:text-sm text-text-200 dark:text-gray-400 mb-2">
                    <Clock size={12} className="mr-1" />
                    <span>Posted {job.posted_date}</span>
                    <span className="mx-2">•</span>
                    <span>{job.applicants} applicants</span>
                  </div>
                  
                  <div className="text-xs lg:text-sm text-text-200 dark:text-gray-400">{job.location} • {job.type}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 lg:py-8 text-text-200 dark:text-gray-400">
              <p className="text-sm lg:text-base">No jobs posted yet</p>
              <button 
                onClick={() => navigate('/jobs')}
                className="mt-2 text-primary-100 dark:text-blue-400 hover:underline text-sm lg:text-base"
              >
                Create your first job posting
              </button>
            </div>
          )}
          
          <button 
            onClick={() => navigate('/jobs')}
            className="w-full mt-4 text-center py-2 border border-primary-100 dark:border-blue-400 rounded-md text-primary-100 dark:text-blue-400 hover:bg-primary-100/5 dark:hover:bg-blue-400/5 transition-colors text-sm lg:text-base"
          >
            View All Jobs
          </button>
        </div>
      </div>

      {needsReconnect && linkedinProfile && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkedinIcon className="h-5 w-5 text-[#0077B5]" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please reconnect your LinkedIn account to access organization and advertising data
              </p>
            </div>
            <Button
              onClick={handleReconnectLinkedIn}
              className="bg-[#0077B5] hover:bg-[#006097] text-white"
              size="sm"
            >
              Reconnect LinkedIn
            </Button>
          </div>
        </div>
      )}

      {linkedinProfile && (
        <>
          {/* LinkedIn Organizations Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">LinkedIn Organizations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingOrgs ? (
                <Card className="col-span-full flex items-center justify-center p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
                </Card>
              ) : organizations.length > 0 ? (
                organizations.map((org: any) => (
                  <Card key={org.id} className="bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        {org.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Followers: {org.followerCount || 0}
                        </p>
                        {org.website && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Website: {org.website}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full p-6">
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    No organizations found. Connect your LinkedIn account to manage your organizations.
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* LinkedIn Advertising Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">LinkedIn Advertising</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingAds ? (
                <Card className="col-span-full flex items-center justify-center p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
                </Card>
              ) : adAccounts.length > 0 ? (
                adAccounts.map((account: any) => (
                  <Card key={account.id} className="bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {account.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Status: <span className="capitalize">{account.status}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Type: {account.type}
                        </p>
                        {account.currency && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Currency: {account.currency}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full p-6">
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    No advertising accounts found. Connect your LinkedIn account to manage your ad campaigns.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
