
import React from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { mockJobs, mockCandidates } from '@/data/mockData';
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const activeJobs = mockJobs.filter(job => job.status === 'Active').length;
  const totalCandidates = mockCandidates.length;
  const interviewScheduled = mockCandidates.filter(c => c.status === 'Interview').length;
  
  // Calculate hiring funnel data
  const newCandidates = mockCandidates.filter(c => c.status === 'New').length;
  const screeningCandidates = mockCandidates.filter(c => c.status === 'Screening').length;
  const interviewCandidates = interviewScheduled;
  const assessmentCandidates = mockCandidates.filter(c => c.status === 'Assessment').length;
  const offerCandidates = mockCandidates.filter(c => c.status === 'Offer').length;
  const hiredCandidates = mockCandidates.filter(c => c.status === 'Hired').length;
  
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
      value: `${Math.round((hiredCandidates / totalCandidates) * 100)}%`,
      icon: TrendingUp,
      color: 'bg-emerald-500',
      link: '/candidates'
    }
  ];
  
  const recentJobs = mockJobs
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, 3);
  
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
                <div className="bg-primary-100 h-2 rounded-full" style={{ width: `${(newCandidates / totalCandidates) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Screening</span>
                <span className="font-medium">{screeningCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(screeningCandidates / totalCandidates) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Interview</span>
                <span className="font-medium">{interviewCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(interviewCandidates / totalCandidates) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Assessment</span>
                <span className="font-medium">{assessmentCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(assessmentCandidates / totalCandidates) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Offer</span>
                <span className="font-medium">{offerCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(offerCandidates / totalCandidates) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Hired</span>
                <span className="font-medium">{hiredCandidates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(hiredCandidates / totalCandidates) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-100 mb-4">Recent Job Postings</h2>
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
