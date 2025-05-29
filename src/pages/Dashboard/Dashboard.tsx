
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Slider } from '@/components/UI/slider';
import { Progress } from '@/components/UI/progress';
import { Badge } from '@/components/UI/badge';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Mail, 
  UserPlus,
  Target,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { leadsService } from '@/services/leadsService';
import { supabase } from '@/lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalJobs: 0,
    totalCandidates: 0,
    recentApplications: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [leadsData, jobsData, candidatesData] = await Promise.all([
        leadsService.getLeads(),
        supabase.from('jobs').select('*').limit(10),
        supabase.from('candidates').select('*').limit(10)
      ]);

      setStats({
        totalLeads: leadsData.length,
        totalJobs: jobsData.data?.length || 0,
        totalCandidates: candidatesData.data?.length || 0,
        recentApplications: Math.floor(Math.random() * 15) + 5
      });

      // Mock recent activity
      setRecentActivity([
        { type: 'lead', message: 'New lead added: John Smith', time: '2 hours ago', icon: UserPlus },
        { type: 'job', message: 'Job posting "Senior Developer" published', time: '4 hours ago', icon: Briefcase },
        { type: 'application', message: '3 new applications received', time: '6 hours ago', icon: Mail },
        { type: 'interview', message: 'Interview scheduled with Sarah Connor', time: '1 day ago', icon: Calendar },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const planItems = [
    { label: "Ideas generated", current: 20, max: 40 },
    { label: "Active themes", current: 1, max: 2 },
    { label: "Posts generated", current: 1, max: 3 },
    { label: "Posts rewritten", current: 0, max: 3 },
    { label: "Comments generated", current: 0, max: 30 },
    { label: "Extension posts", current: 0, max: 5 },
    { label: "Data refreshes", current: 0, max: 0 },
    { label: "Chat messages", current: 0, max: 2 },
  ];

  const quickStats = [
    { title: 'Total Leads', value: stats.totalLeads, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Candidates', value: stats.totalCandidates, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Applications', value: stats.recentApplications, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          Klarus Dashboard
        </h1>
        {user && (
          <h2 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Welcome back, {user.user_metadata?.full_name || user.email || 'User'}!
          </h2>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Usage */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <CardTitle className="text-lg sm:text-xl">Plan Usage</CardTitle>
              <Button variant="outline" size="sm" className="self-start sm:self-auto">
                Upgrade limits
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 pt-2">
            {planItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.current}/{item.max}
                  </span>
                </div>
                <Slider
                  value={[item.current]}
                  max={item.max > 0 ? item.max : 1}
                  disabled={item.max === 0}
                  className="my-1"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'lead' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'job' ? 'bg-green-100 text-green-600' :
                    activity.type === 'application' ? 'bg-orange-100 text-orange-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Recruitment Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Monthly Lead Target</span>
                <span className="text-sm text-gray-600">{stats.totalLeads}/50</span>
              </div>
              <Progress value={(stats.totalLeads / 50) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Job Placements</span>
                <span className="text-sm text-gray-600">3/10</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Interview Success Rate</span>
                <span className="text-sm text-gray-600">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Lead
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Briefcase className="w-4 h-4 mr-2" />
              Create Job Posting
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Send Campaign Email
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
