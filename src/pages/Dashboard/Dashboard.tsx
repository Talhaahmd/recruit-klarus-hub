
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Slider } from '@/components/UI/slider';
import { Badge } from '@/components/UI/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Mail, 
  UserPlus,
  Clock,
  CheckCircle,
  Settings
} from 'lucide-react';
import { leadsService } from '@/services/leadsService';
import { profilesService } from '@/services/profilesService';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// Define a type for our activity items for better type safety
type Activity = {
  id: string;
  type: 'lead' | 'job' | 'application' | 'interview';
  message: string;
  time: string;
  timestamp: Date;
  icon: React.ElementType;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalJobs: 0,
    totalCandidates: 0,
    recentApplications: 0
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [submittingRole, setSubmittingRole] = useState(false);

  const handleRoleSelect = async (role: 'personal' | 'hr') => {
    if (submittingRole) return;
    setSubmittingRole(true);
    try {
      const updated = await profilesService.updateProfile({ role } as any);
      if (!updated) throw new Error('Failed to save role');
      toast.success('Role saved successfully!');
      setShowRoleModal(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save role');
    } finally {
      setSubmittingRole(false);
    }
  };

  const fetchInitialActivity = async () => {
    try {
      // Fetch latest 5 from each source
      const [leadsRes, jobsRes, candidatesRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('candidates').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      const leadActivities: Activity[] = (leadsRes.data || []).map(lead => ({
        id: `lead-${lead.id}`,
        type: 'lead',
        message: `New lead added: ${lead.full_name}`,
        timestamp: new Date(lead.created_at),
        time: formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }),
        icon: UserPlus
      }));

      const jobActivities: Activity[] = (jobsRes.data || []).map(job => ({
        id: `job-${job.id}`,
        type: 'job',
        message: `Job posting "${job.title}" published`,
        timestamp: new Date(job.created_at),
        time: formatDistanceToNow(new Date(job.created_at), { addSuffix: true }),
        icon: Briefcase
      }));

      const candidateActivities: Activity[] = (candidatesRes.data || []).map(candidate => ({
        id: `candidate-${candidate.id}`,
        type: 'application',
        message: `New application from ${candidate.name}`,
        timestamp: new Date(candidate.created_at),
        time: formatDistanceToNow(new Date(candidate.created_at), { addSuffix: true }),
        icon: Mail
      }));
      
      // Combine, sort, and slice
      const allActivities = [...leadActivities, ...jobActivities, ...candidateActivities];
      allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setRecentActivity(allActivities.slice(0, 5));

    } catch (error) {
      console.error("Error fetching initial activity:", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [leadsData, jobsData, candidatesData] = await Promise.all([
        leadsService.getLeads(),
        supabase.from('jobs').select('*'),
        supabase.from('candidates').select('*')
      ]);

      setStats({
        totalLeads: leadsData.length,
        totalJobs: jobsData.data?.length || 0,
        totalCandidates: candidatesData.data?.length || 0,
        recentApplications: (candidatesData.data || []).filter(c => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
      });

      await fetchInitialActivity();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadDashboardData();

    const handleNewLead = (payload: any) => {
      const newLead = payload.new;
      const activity: Activity = {
        id: `lead-${newLead.id}`,
        type: 'lead',
        message: `New lead added: ${newLead.full_name}`,
        timestamp: new Date(newLead.created_at),
        time: formatDistanceToNow(new Date(newLead.created_at), { addSuffix: true }),
        icon: UserPlus
      };
      setRecentActivity(prev => [activity, ...prev].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5));
    };

    const handleNewJob = (payload: any) => {
      const newJob = payload.new;
      const activity: Activity = {
        id: `job-${newJob.id}`,
        type: 'job',
        message: `Job posting "${newJob.title}" published`,
        timestamp: new Date(newJob.created_at),
        time: formatDistanceToNow(new Date(newJob.created_at), { addSuffix: true }),
        icon: Briefcase
      };
      setRecentActivity(prev => [activity, ...prev].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5));
    };
    
    const handleNewCandidate = (payload: any) => {
      const newCandidate = payload.new;
      const activity: Activity = {
        id: `candidate-${newCandidate.id}`,
        type: 'application',
        message: `New application from ${newCandidate.name}`,
        timestamp: new Date(newCandidate.created_at),
        time: formatDistanceToNow(new Date(newCandidate.created_at), { addSuffix: true }),
        icon: Mail
      };
      setRecentActivity(prev => [activity, ...prev].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5));
    };

    const leadsChannel = supabase.channel('public:leads')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, handleNewLead)
      .subscribe();

    const jobsChannel = supabase.channel('public:jobs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'jobs' }, handleNewJob)
      .subscribe();

    const candidatesChannel = supabase.channel('public:candidates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'candidates' }, handleNewCandidate)
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(candidatesChannel);
    };
  }, []);

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

      {/* Testing Controls */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Testing Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowRoleModal(true)}
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            Open Role Selector Modal
          </Button>
        </CardContent>
      </Card>

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
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6">
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

      {/* Role Selector Modal */}
      <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose Your Role</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card 
              className="border border-gray-200 dark:border-gray-800 hover:border-primary transition-colors cursor-pointer"
              onClick={() => handleRoleSelect('personal')}
            >
              <CardHeader>
                <CardTitle>Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  I'm here for personal branding or a job search.
                </p>
                <Button 
                  disabled={submittingRole} 
                  className="w-full"
                  variant="outline"
                >
                  Choose Personal
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="border border-gray-200 dark:border-gray-800 hover:border-primary transition-colors cursor-pointer"
              onClick={() => handleRoleSelect('hr')}
            >
              <CardHeader>
                <CardTitle>HR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  I'm hiring or managing candidates.
                </p>
                <Button 
                  disabled={submittingRole} 
                  className="w-full"
                  variant="outline"
                >
                  Choose HR
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
