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
  Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobsService } from '@/services/jobsService';
import { candidatesService } from '@/services/candidatesService';
import { Job } from '@/services/jobsService';
import { Candidate } from '@/services/candidatesService';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const [jobsData, candidatesData] = await Promise.all([
          jobsService.getJobs(),
          candidatesService.getCandidates()
        ]);
        
        console.log('Fetched jobs:', jobsData);
        setJobs(jobsData);
        setCandidates(candidatesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
      color: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      link: '/jobs'
    },
    {
      title: 'Total Candidates',
      value: totalCandidates,
      icon: Users,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      link: '/candidates'
    },
    {
      title: 'Interviews Scheduled',
      value: interviewScheduled,
      icon: Calendar,
      color: 'bg-gradient-to-r from-amber-500 to-amber-600',
      link: '/calendar'
    },
    {
      title: 'Conversion Rate',
      value: totalCandidates ? `${Math.round((hiredCandidates / totalCandidates) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      link: '/candidates'
    }
  ];
  
  // Get recent jobs
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime())
    .slice(0, 3);
  
  if (isLoading) {
    return (
      <div className="bg-black min-h-screen">
        <Header 
          title="Dashboard" 
          subtitle="Loading dashboard data..."
        />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-black min-h-screen text-white">
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's an overview of your hiring activities."
      />
      
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => navigate('/submission')}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0"
        >
          <Upload size={16} />
          View Submissions
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div 
            key={index}
            onClick={() => navigate(card.link)}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:translate-y-[-2px] transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="text-white" size={20} />
              </div>
              <ArrowUpRight size={18} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="text-sm text-gray-400">{card.title}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Hiring Funnel</h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">New Applications</span>
                <span className="font-medium text-white">{newCandidates}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full" style={{ width: totalCandidates ? `${(newCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Screening</span>
                <span className="font-medium text-white">{screeningCandidates}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: totalCandidates ? `${(screeningCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Interview</span>
                <span className="font-medium text-white">{interviewCandidates}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full" style={{ width: totalCandidates ? `${(interviewCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Assessment</span>
                <span className="font-medium text-white">{assessmentCandidates}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: totalCandidates ? `${(assessmentCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Offer</span>
                <span className="font-medium text-white">{offerCandidates}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: totalCandidates ? `${(offerCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Hired</span>
                <span className="font-medium text-white">{hiredCandidates}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: totalCandidates ? `${(hiredCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Job Postings</h2>
          {recentJobs.length > 0 ? (
            <div className="space-y-5">
              {recentJobs.map(job => (
                <div 
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-cyan-400">{job.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1 border border-green-500/30">
                      <CheckCircle size={12} />
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-400">
                    <Clock size={14} className="mr-1" />
                    <span>Posted {job.posted_date}</span>
                    <span className="mx-2">•</span>
                    <span>{job.applicants} applicants</span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-400">{job.location} • {job.type}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No jobs posted yet</p>
              <button 
                onClick={() => navigate('/jobs')}
                className="mt-2 text-cyan-400 hover:underline"
              >
                Create your first job posting
              </button>
            </div>
          )}
          
          <button 
            onClick={() => navigate('/jobs')}
            className="w-full mt-4 text-center py-2 border border-cyan-500 rounded-md text-cyan-400 hover:bg-cyan-500/10 transition-colors duration-200"
          >
            View All Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
