import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import {
  PenSquare,
  CalendarDays,
  Sparkles,
  Hash,
  BarChart3,
  Clock,
  ThumbsUp,
  MessageSquare,
  Eye,
  Share2,
  Users,
  FileText,
  Brain,
  GraduationCap,
  MessageCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

// Mock data for LinkedIn growth dashboard
const mockGrowthData = {
  postsPublished: 18,
  drafts: [
    {
      id: 1,
      title: '5 lessons from shipping a side project to 1k users',
      createdAt: new Date('2025-06-01T09:00:00'),
      hashtags: ['#buildinpublic', '#react', '#startups']
    },
    {
      id: 2,
      title: 'My framework for writing posts that people actually read',
      createdAt: new Date('2025-06-02T10:30:00'),
      hashtags: ['#content', '#writing', '#growth']
    }
  ],
  ideas: [
    { id: 1, topic: 'How I use AI to draft posts in 5 minutes', score: 86 },
    { id: 2, topic: 'Things I wish I knew before my first PM role', score: 78 },
    { id: 3, topic: 'A simple system for consistent posting (with templates)', score: 82 }
  ],
  scheduled: [
    {
      id: 1,
      title: 'What 30 days of daily posting taught me',
      scheduledFor: new Date('2025-06-28T08:00:00')
    }
  ],
  metrics: { engagementRate: 3.2, avgLikes: 56, avgComments: 12, profileViews: 240 },
  recentPosts: [
    { id: 1, title: 'Why I post daily', date: new Date('2025-06-20T08:00:00'), likes: 72, comments: 18, shares: 9 },
    { id: 2, title: 'AI writing workflow (templates inside)', date: new Date('2025-06-18T08:00:00'), likes: 54, comments: 12, shares: 6 },
    { id: 3, title: '3 mistakes killing your reach', date: new Date('2025-06-15T08:00:00'), likes: 69, comments: 21, shares: 11 }
  ],
  connectionGrowth: [
    { id: 1, label: 'Jun 1 – 7', newConnections: 12, total: 820 },
    { id: 2, label: 'Jun 8 – 14', newConnections: 19, total: 839 },
    { id: 3, label: 'Jun 15 – 21', newConnections: 23, total: 862 }
  ]
};

const PersonalDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

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

  const totalEngagement = mockGrowthData.recentPosts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);

  return (
    <div className="space-y-6">
      {/* LinkedIn Growth Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Posts Published</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.postsPublished}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <PenSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.metrics.profileViews}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Connections</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.connectionGrowth.at(-1)?.newConnections ?? 0}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Engagement</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEngagement}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Drafts */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenSquare className="w-5 h-5" />
              Recent Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGrowthData.drafts.map((draft) => (
                <div key={draft.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{draft.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Created {formatDistanceToNow(draft.createdAt, { addSuffix: true })}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Draft</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {draft.hashtags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-900">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/themes">
                <Button variant="default">Open Content Studio</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Posts */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Scheduled Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGrowthData.scheduled.map((post) => (
                <div key={post.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{post.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled for {post.scheduledFor.toLocaleDateString()} at {post.scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Scheduled</Badge>
                  </div>
                </div>
              ))}
              {mockGrowthData.scheduled.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">No posts scheduled. Plan your next post to stay consistent.</div>
              )}
            </div>
            <div className="mt-4">
              <Link to="/ideas">
                <Button variant="outline">Create New Post</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Tracker & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Tracker */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Engagement Tracker (recent posts)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockGrowthData.recentPosts.map((p) => (
                <div key={p.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.date.toLocaleDateString()}</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Post</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
                      <div className="text-lg font-bold">{p.likes}</div>
                    </div>
                    <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Comments</div>
                      <div className="text-lg font-bold">{p.comments}</div>
                    </div>
                    <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Shares</div>
                      <div className="text-lg font-bold">{p.shares}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Overview (avg last 5 posts)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                <div className="mx-auto mb-2 p-2 rounded-full bg-blue-100 dark:bg-blue-900 w-10 h-10 flex items-center justify-center">
                  <ThumbsUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.metrics.avgLikes}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Likes</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                <div className="mx-auto mb-2 p-2 rounded-full bg-green-100 dark:bg-green-900 w-10 h-10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.metrics.avgComments}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Comments</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                <div className="mx-auto mb-2 p-2 rounded-full bg-purple-100 dark:bg-purple-900 w-10 h-10 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round((mockGrowthData.recentPosts.reduce((s, p) => s + p.shares, 0)) / Math.max(mockGrowthData.recentPosts.length, 1))}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Shares</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                <div className="mx-auto mb-2 p-2 rounded-full bg-orange-100 dark:bg-orange-900 w-10 h-10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.metrics.profileViews}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Profile Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Tools Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Career Development Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/ats-analysis">
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-blue-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-3 p-3 rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">ATS Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Optimize your CV for job applications</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/skill-dna">
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-purple-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-3 p-3 rounded-full bg-purple-100 dark:bg-purple-900 w-12 h-12 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skill DNA</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discover your professional archetype</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/learning-path">
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-green-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-3 p-3 rounded-full bg-green-100 dark:bg-green-900 w-12 h-12 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Learning Path</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Personalized skill development roadmap</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/interview-prep">
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-orange-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-3 p-3 rounded-full bg-orange-100 dark:bg-orange-900 w-12 h-12 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Interview Prep</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered interview gameplan</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Connections Growth & Ideas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Growth Insights */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Connection Growth Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockGrowthData.connectionGrowth.map((cg) => (
                <div key={cg.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{cg.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total: {cg.total}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">+{cg.newConnections}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Topic Ideas */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Top Topic Ideas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockGrowthData.ideas.map((idea) => (
                <div key={idea.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">{idea.topic}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Relevance score: {idea.score}</p>
                  </div>
                  <Button size="sm" variant="outline">Draft</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalDashboard;
