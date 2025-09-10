import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  TrendingUp, 
  User,
  Clock,
  CheckCircle,
  Star,
  MapPin,
  DollarSign
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data for personal dashboard
const mockPersonalData = {
  applications: [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'Under Review',
      appliedDate: new Date('2024-01-15'),
      location: 'San Francisco, CA',
      salary: '$80,000 - $100,000'
    },
    {
      id: 2,
      jobTitle: 'React Developer',
      company: 'StartupXYZ',
      status: 'Interview Scheduled',
      appliedDate: new Date('2024-01-10'),
      location: 'Remote',
      salary: '$70,000 - $90,000'
    },
    {
      id: 3,
      jobTitle: 'UI/UX Designer',
      company: 'DesignStudio',
      status: 'Rejected',
      appliedDate: new Date('2024-01-05'),
      location: 'New York, NY',
      salary: '$60,000 - $80,000'
    }
  ],
  savedJobs: [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'BigTech Corp',
      location: 'Seattle, WA',
      salary: '$100,000 - $130,000',
      postedDate: new Date('2024-01-20')
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'Innovation Labs',
      location: 'Austin, TX',
      salary: '$85,000 - $110,000',
      postedDate: new Date('2024-01-18')
    }
  ],
  upcomingInterviews: [
    {
      id: 1,
      company: 'StartupXYZ',
      position: 'React Developer',
      date: new Date('2024-01-25T14:00:00'),
      type: 'Technical Interview',
      location: 'Video Call'
    }
  ]
};

const PersonalDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'under review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'interview scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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
      {/* Personal Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Applications Sent
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockPersonalData.applications.length}
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
                  Interviews Scheduled
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockPersonalData.upcomingInterviews.length}
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
                  Saved Jobs
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockPersonalData.savedJobs.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Profile Views
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  24
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
        {/* Recent Applications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPersonalData.applications.map((application) => (
                <div key={application.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{application.jobTitle}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{application.company}</p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {application.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      {application.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDistanceToNow(application.appliedDate, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPersonalData.upcomingInterviews.map((interview) => (
                <div key={interview.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{interview.position}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{interview.company}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {interview.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {interview.date.toLocaleDateString()} at {interview.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      </div>

      {/* Saved Jobs */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Saved Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockPersonalData.savedJobs.map((job) => (
              <div key={job.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Apply Now
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDistanceToNow(job.postedDate, { addSuffix: true })}
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
              Browse Jobs
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <User className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDashboard;
