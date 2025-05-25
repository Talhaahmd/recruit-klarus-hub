
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
    </div>
  );
};

export default Dashboard;
