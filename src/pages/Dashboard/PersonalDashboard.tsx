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
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

// Mock data for LinkedIn growth dashboard
const mockGrowthData = {
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
  metrics: { engagementRate: 3.2, avgLikes: 56, avgComments: 12, profileViews: 240 }
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

  return (
    <div className="space-y-6">
      {/* Growth Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.drafts.length}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.scheduled.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <CalendarDays className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ideas Queue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.ideas.length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Hash className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPercent(mockGrowthData.metrics.engagementRate)}</p>
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

      {/* Ideas & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="mx-auto mb-2 p-2 rounded-full bg-orange-100 dark:bg-orange-900 w-10 h-10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockGrowthData.metrics.profileViews}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Profile Views</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                <div className="mx-auto mb-2 p-2 rounded-full bg-purple-100 dark:bg-purple-900 w-10 h-10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPercent(mockGrowthData.metrics.engagementRate)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalDashboard;
