import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Calendar, Clock, Send, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { linkedinService, LinkedInPost } from '@/services/linkedinService';

const BuildProfile: React.FC = () => {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [postContent, setPostContent] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [scheduledContent, setScheduledContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [scheduledNiche, setScheduledNiche] = useState<string>('');
  const [isScheduleSubmitting, setIsScheduleSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await linkedinService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching LinkedIn posts:', error);
      }
    };
    
    fetchPosts();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (postContent.trim().length < 50) {
        toast.error('Post content should be at least 50 characters long');
        return;
      }
      
      // Create the LinkedIn post
      const newPost = await linkedinService.createPost({
        content: postContent,
        scheduled_date: null,
        scheduled_time: null,
        niche: selectedNiche || 'General'
      });
      
      if (newPost) {
        // Add the new post to the posts list
        setPosts([newPost, ...posts]);
        setPostContent('');
        toast.success('LinkedIn post created successfully');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create LinkedIn post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduleSubmitting(true);
    
    try {
      if (scheduledContent.trim().length < 50) {
        toast.error('Post content should be at least 50 characters long');
        return;
      }
      
      // Create the scheduled LinkedIn post
      const newPost = await linkedinService.createPost({
        content: scheduledContent,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        niche: scheduledNiche || 'General'
      });
      
      if (newPost) {
        // Add the new scheduled post to the posts list
        setPosts([newPost, ...posts]);
        setScheduledContent('');
        setScheduledDate(null);
        setScheduledTime(null);
        setOpenScheduleDialog(false);
        toast.success('LinkedIn post scheduled successfully');
      }
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error('Failed to schedule LinkedIn post');
    } finally {
      setIsScheduleSubmitting(false);
    }
  };
  
  const handleMarkAsPosted = async (id: string) => {
    try {
      const success = await linkedinService.markAsPosted(id);
      if (success) {
        // Update the post in the local state
        setPosts(posts.map(post => 
          post.id === id ? { ...post, posted: true } : post
        ));
      }
    } catch (error) {
      console.error('Error marking post as posted:', error);
    }
  };
  
  const handleDeletePost = async (id: string) => {
    // In a real app, you would call an API to delete the post
    // For now, we'll just remove it from the local state
    setPosts(posts.filter(post => post.id !== id));
    toast.success('Post deleted successfully');
  };
  
  const niches = [
    'Career Advice',
    'Industry Trends',
    'Company Culture',
    'Leadership',
    'Technology',
    'Recruitment',
    'Professional Development',
    'General'
  ];
  
  return (
    <div>
      <Header 
        title="Build Your Profile" 
        subtitle="Create and schedule LinkedIn posts to build your professional brand."
      />
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          <div className="glass-card p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Niche
                  </label>
                  <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {niches.map((niche) => (
                        <SelectItem key={niche} value={niche}>
                          {niche}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Post Content
                  </label>
                  <Textarea
                    placeholder="Write your LinkedIn post here..."
                    className="min-h-[200px]"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <div className="text-xs text-text-200 mt-1">
                    {postContent.length} characters (minimum 50)
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenScheduleDialog(true)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule for Later
                  </Button>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Post Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-6">
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="glass-card p-6">
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-medium text-primary-100">
                      {post.niche}
                    </div>
                    <div className="flex items-center gap-2">
                      {post.posted ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Posted
                        </span>
                      ) : post.scheduled_date ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Scheduled
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Draft
                        </span>
                      )}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Trash2 size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 whitespace-pre-line">
                    {post.content}
                  </div>
                  
                  {post.scheduled_date && (
                    <div className="mt-4 flex items-center text-sm text-text-200">
                      <Calendar size={14} className="mr-1" />
                      Scheduled for: {format(
                        new Date(post.scheduled_date), 
                        'MMMM d, yyyy'
                      )}
                      {post.scheduled_time && (
                        <>
                          <Clock size={14} className="ml-3 mr-1" />
                          {post.scheduled_time}
                        </>
                      )}
                    </div>
                  )}
                  
                  {!post.posted && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsPosted(post.id)}
                      >
                        Mark as Posted
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-text-200">No posts yet. Create your first LinkedIn post!</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setOpenScheduleDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule a Post
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Schedule Post Dialog */}
      <Dialog open={openScheduleDialog} onOpenChange={setOpenScheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule LinkedIn Post</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleScheduleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Niche
                </label>
                <Select value={scheduledNiche} onValueChange={setScheduledNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {niches.map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Post Content
                </label>
                <Textarea
                  placeholder="Write your LinkedIn post here..."
                  className="min-h-[150px]"
                  value={scheduledContent}
                  onChange={(e) => setScheduledContent(e.target.value)}
                />
                <div className="text-xs text-text-200 mt-1">
                  {scheduledContent.length} characters (minimum 50)
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Schedule Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {scheduledDate ? (
                          format(scheduledDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Schedule Time
                  </label>
                  <Select value={scheduledTime || ''} onValueChange={setScheduledTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <React.Fragment key={hour}>
                          <SelectItem value={`${hour}:00`}>
                            {hour === 0 ? '12:00 AM' : 
                             hour < 12 ? `${hour}:00 AM` : 
                             hour === 12 ? '12:00 PM' : 
                             `${hour - 12}:00 PM`}
                          </SelectItem>
                          <SelectItem value={`${hour}:30`}>
                            {hour === 0 ? '12:30 AM' : 
                             hour < 12 ? `${hour}:30 AM` : 
                             hour === 12 ? '12:30 PM' : 
                             `${hour - 12}:30 PM`}
                          </SelectItem>
                        </React.Fragment>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={isScheduleSubmitting}>
                {isScheduleSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Post
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuildProfile;
