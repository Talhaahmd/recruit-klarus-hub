import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { useAuth } from '@/contexts/AuthContext';
import RestrictedAccess from '@/components/UI/RestrictedAccess';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  UserPlus,
  Clock,
  CheckCircle,
  Mail,
  Eye,
  Star,
  MapPin,
  DollarSign,
  BarChart3,
  FileText,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data for HR dashboard
const mockHRData = {
  candidates: [
    {
      id: 1,
      name: 'John Smith',
      position: 'Frontend Developer',
      status: 'Interview Scheduled',
      appliedDate: new Date('2024-01-20'),
      experience: '3 years',
      location: 'San Francisco, CA',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'UI/UX Designer',
      status: 'Under Review',
      appliedDate: new Date('2024-01-18'),
      experience: '5 years',
      location: 'New York, NY',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Mike Chen',
      position: 'Backend Developer',
      status: 'Hired',
      appliedDate: new Date('2024-01-15'),
      experience: '4 years',
      location: 'Seattle, WA',
      rating: 4.9
    }
  ],
  activeJobs: [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      applicants: 24,
      postedDate: new Date('2024-01-10'),
      location: 'San Francisco, CA',
      salary: '$100,000 - $130,000',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      applicants: 18,
      postedDate: new Date('2024-01-12'),
      location: 'Remote',
      salary: '$120,000 - $150,000',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      department: 'Marketing',
      applicants: 12,
      postedDate: new Date('2024-01-08'),
      location: 'Austin, TX',
      salary: '$60,000 - $80,000',
      status: 'Paused'
    }
  ],
  upcomingInterviews: [
    {
      id: 1,
      candidateName: 'John Smith',
      position: 'Frontend Developer',
      date: new Date('2024-01-25T14:00:00'),
      type: 'Technical Interview',
      interviewer: 'Jane Doe',
      location: 'Conference Room A'
    },
    {
      id: 2,
      candidateName: 'Sarah Johnson',
      position: 'UI/UX Designer',
      date: new Date('2024-01-26T10:00:00'),
      type: 'Portfolio Review',
      interviewer: 'Bob Wilson',
      location: 'Video Call'
    }
  ],
  metrics: {
    totalApplications: 156,
    interviewsThisWeek: 8,
    hiredThisMonth: 3,
    averageTimeToHire: 21
  }
};

const HRDashboard: React.FC = () => {
  const { isRecruitmentRestricted } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show restricted access message if recruitment is restricted
  if (isRecruitmentRestricted) {
    return (
      <RestrictedAccess 
        title="HR Dashboard Restricted" 
        message="HR recruitment features are currently unavailable. Please contact support for more information." 
        showBackButton={false}
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'under review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'interview scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'hired':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'paused':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HR Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockHRData.metrics.totalApplications}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Interviews This Week
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockHRData.metrics.interviewsThisWeek}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Hired This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockHRData.metrics.hiredThisMonth}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Time to Hire
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockHRData.metrics.averageTimeToHire} days
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHRData.candidates.map((candidate) => (
                <div key={candidate.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{candidate.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.position}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{candidate.rating}</span>
                      </div>
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {candidate.experience}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDistanceToNow(candidate.appliedDate, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Job Postings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Active Job Postings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHRData.activeJobs.map((job) => (
                <div key={job.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{job.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {job.applicants} applicants
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={14} />
                    Posted {formatDistanceToNow(job.postedDate, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockHRData.upcomingInterviews.map((interview) => (
              <div key={interview.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{interview.candidateName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{interview.position}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {interview.type}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {interview.date.toLocaleDateString()} at {interview.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    Interviewer: {interview.interviewer}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {interview.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button className="w-full justify-start" variant="outline">
              <Briefcase className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRDashboard;
