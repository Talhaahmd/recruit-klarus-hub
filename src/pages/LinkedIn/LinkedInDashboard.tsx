
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import BuildProfile from '@/pages/BuildProfile/BuildProfile';
import { TrendingUp, Users, Eye, Heart, MessageSquare, Share2, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const LinkedInDashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading LinkedIn Zero...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/linkedin-login" replace />;
  }

  const stats = [
    { title: 'Profile Views', value: '2,847', change: '+12.5%', icon: Eye, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Post Impressions', value: '45.2K', change: '+28.3%', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Engagement Rate', value: '8.4%', change: '+5.2%', icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { title: 'New Connections', value: '156', change: '+18.7%', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const candidateUpdates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Frontend Developer',
      company: 'Tech Corp',
      status: 'Interested',
      avatar: 'SJ',
      time: '2 hours ago',
      engagement: 'Viewed your profile',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'StartupXYZ',
      status: 'Applied',
      avatar: 'MC',
      time: '4 hours ago',
      engagement: 'Liked your recent post',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'Design Studio',
      status: 'Connected',
      avatar: 'ER',
      time: '6 hours ago',
      engagement: 'Sent connection request',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Data Scientist',
      company: 'Analytics Inc',
      status: 'Reviewing',
      avatar: 'DK',
      time: '1 day ago',
      engagement: 'Commented on your article',
      badgeColor: 'bg-orange-100 text-orange-800'
    }
  ];

  const recentPosts = [
    {
      id: 1,
      content: "🚀 Exciting news! We're expanding our remote team and looking for talented developers...",
      engagement: { likes: 127, comments: 23, shares: 8 },
      time: '2 days ago'
    },
    {
      id: 2,
      content: "💡 The future of work is here. Here's how AI is transforming recruitment...",
      engagement: { likes: 89, comments: 15, shares: 12 },
      time: '5 days ago'
    },
    {
      id: 3,
      content: "🎯 Building diverse teams: Our approach to inclusive hiring practices...",
      engagement: { likes: 203, comments: 31, shares: 19 },
      time: '1 week ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                className="w-auto h-10" 
                src="/lovable-uploads/67d45eae-154d-4a02-a7a5-1f115188b97b.png" 
                alt="Klarus HR Logo" 
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LinkedIn Zero
                </h1>
                <p className="text-sm text-gray-500">AI-Powered Content Creation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                Professional Plan
              </Badge>
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">KH</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Candidate Updates */}
          <Card className="lg:col-span-1 border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Candidate Updates
                </span>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidateUpdates.map((candidate) => (
                <div key={candidate.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50/80 transition-colors cursor-pointer">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                      {candidate.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{candidate.name}</p>
                      <span className="text-xs text-gray-500">{candidate.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{candidate.role} at {candidate.company}</p>
                    <p className="text-xs text-gray-500 mb-2">{candidate.engagement}</p>
                    <Badge className={`text-xs ${candidate.badgeColor} border-0`}>
                      {candidate.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Posts Performance */}
          <Card className="lg:col-span-2 border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Recent Posts Performance
                </span>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Analytics
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{post.engagement.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span>{post.engagement.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4 text-green-500" />
                        <span>{post.engagement.shares}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{post.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content Creation Section */}
        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-900 mb-2">Create LinkedIn Content</CardTitle>
                <p className="text-gray-600">Generate engaging posts with AI assistance</p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Smart Scheduling Available</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BuildProfile />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LinkedInDashboard;
