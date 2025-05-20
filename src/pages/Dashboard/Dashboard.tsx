
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobsService } from '@/services/jobsService';
import { candidatesService } from '@/services/candidatesService';
import { Job } from '@/services/jobsService';
import { Candidate } from '@/services/candidatesService';

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
  
  // Get recent jobs
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, 3);
  
  if (isLoading) {
    return (
      <div>
        <Header 
          title="Dashboard" 
          subtitle="Loading dashboard data..."
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
        title="Dashboard" 
        subtitle="Welcome back! Here's an overview of your hiring activities."
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div 
            key={index}
            onClick={() => navigate(card.link)}
            className="glass-card p-6 cursor-pointer hover:translate-y-[-2px]"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="text-white" size={20} />
              </div>
              <ArrowUpRight size={18} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-text-100">{card.value}</div>
            <div className="text-sm text-text-200">{card.title}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-100 mb-4">Hiring Funnel</h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>New Applications</span>
                <span className="font-medium">{newCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-100 h-2 rounded-full" style={{ width: totalCandidates ? `${(newCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Screening</span>
                <span className="font-medium">{screeningCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: totalCandidates ? `${(screeningCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Interview</span>
                <span className="font-medium">{interviewCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: totalCandidates ? `${(interviewCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Assessment</span>
                <span className="font-medium">{assessmentCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: totalCandidates ? `${(assessmentCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Offer</span>
                <span className="font-medium">{offerCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: totalCandidates ? `${(offerCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Hired</span>
                <span className="font-medium">{hiredCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: totalCandidates ? `${(hiredCandidates / totalCandidates) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-100 mb-4">Recent Job Postings</h2>
          {recentJobs.length > 0 ? (
            <div className="space-y-5">
              {recentJobs.map(job => (
                <div 
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-primary-100">{job.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                      <CheckCircle size={12} />
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-text-200">
                    <Clock size={14} className="mr-1" />
                    <span>Posted {job.postedDate}</span>
                    <span className="mx-2">•</span>
                    <span>{job.applicants} applicants</span>
                  </div>
                  
                  <div className="mt-2 text-sm text-text-200">{job.location} • {job.type}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-200">
              <p>No jobs posted yet</p>
              <button 
                onClick={() => navigate('/jobs')}
                className="mt-2 text-primary-100 hover:underline"
              >
                Create your first job posting
              </button>
            </div>
          )}
          
          <button 
            onClick={() => navigate('/jobs')}
            className="w-full mt-4 text-center py-2 border border-primary-100 rounded-md text-primary-100 hover:bg-primary-100/5"
          >
            View All Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
