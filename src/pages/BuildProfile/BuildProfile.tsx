import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Calendar, Clock, Send, Plus, Trash2, Check, ThumbsUp, Loader2 } from 'lucide-react';
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
  DialogDescription,
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
import { useLinkedInPrompt } from '@/hooks/useLinkedInPrompt';
import LinkedInPromptModal from '@/components/UI/LinkedInPromptModal';
import { supabase } from '@/lib/supabase';

const BuildProfile: React.FC = () => {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [postContent, setPostContent] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [customNiche, setCustomNiche] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('Professional');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [scheduledContent, setScheduledContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [scheduledNiche, setScheduledNiche] = useState<string>('');
  const [scheduledCustomNiche, setScheduledCustomNiche] = useState('');
  const [scheduledTone, setScheduledTone] = useState<string>('Professional');
  const [isScheduleSubmitting, setIsScheduleSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { showModal, initiateLinkedInConnect, dismissModal } = useLinkedInPrompt();

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

  // Handle LinkedIn connection callback specifically for BuildProfile
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedInConnected = urlParams.get('linkedin_connected');
    
    if (linkedInConnected === 'true') {
      console.log('LinkedIn connected callback detected in BuildProfile...');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Check for pending post data specific to BuildProfile
      const pendingPostData = sessionStorage.getItem('pending_post_data');
      if (pendingPostData) {
        console.log('Found pending post data for BuildProfile');
        try {
          const postData = JSON.parse(pendingPostData);
          
          // Check if this is BuildProfile data
          if (postData.source === 'BuildProfile') {
            console.log('Processing LinkedIn post generation for BuildProfile...');
            sessionStorage.removeItem('pending_post_data');
            
            // Add delay to ensure token is processed
            setTimeout(() => {
              processLinkedInPost(postData);
            }, 3000);
          } else {
            console.log('Post data is not for BuildProfile - ignoring');
            toast.success('LinkedIn connected successfully!');
          }
        } catch (error) {
          console.error('Error parsing pending post data:', error);
          toast.error('Failed to process post data after LinkedIn connection');
        }
      } else {
        console.log('No pending post data found');
        toast.success('LinkedIn connected successfully!');
      }
    }
  }, []);

  const processLinkedInPost = async (postData: any) => {
    try {
      console.log('Processing LinkedIn post generation with data:', postData);
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-linkedin-post', {
        body: {
          niche: postData.niche,
          tone: postData.tone,
          contentPrompt: postData.content,
          scheduleDate: postData.isScheduled ? postData.scheduledDate : null,
          scheduleTime: postData.isScheduled ? postData.scheduledTime : null
        }
      });

      if (error) {
        console.error('LinkedIn post generation error:', error);
        toast.error(`Failed to generate LinkedIn post: ${error.message}`);
        return;
      }

      if (data?.error) {
        console.error('LinkedIn post generation failed:', data.error);
        toast.error(`Failed to generate LinkedIn post: ${data.error}`);
        return;
      }

      console.log('LinkedIn post generation successful:', data);
      
      // Refresh posts list
      const updatedPosts = await linkedinService.getPosts();
      setPosts(updatedPosts);
      
      // Reset form
      if (postData.isScheduled) {
        setScheduledContent('');
        setScheduledDate(null);
        setScheduledTime(null);
        setScheduledCustomNiche('');
        setScheduledNiche('');
        setOpenScheduleDialog(false);
        setIsScheduleSubmitting(false);
      } else {
        setPostContent('');
        setCustomNiche('');
        setSelectedNiche('');
        setIsSubmitting(false);
      }
      
      // Show success modal
      setSuccessMessage(data.scheduled ? 'Your LinkedIn post has been scheduled successfully!' : 'Your LinkedIn post has been generated and posted successfully!');
      setSuccessModal(true);
      
    } catch (error) {
      console.error('Error processing LinkedIn post:', error);
      toast.error('Failed to process LinkedIn post');
    } finally {
      setIsGenerating(false);
    }
  };

  const tones = [
    'Professional',
    'Inspirational',
    'Conversational',
    'Thoughtful',
    'Celebratory'
  ];
  
  const niches = [
    'Career Advice',
    'Industry Trends',
    'Company Culture',
    'Leadership',
    'Technology',
    'Recruitment',
    'Professional Development'
  ];
  
  const generateLinkedInPost = async (postData: any, isScheduled: boolean = false) => {
    setIsGenerating(true);
    
    try {
      console.log('Generating LinkedIn post with BuildProfile data:', postData);
      
      // Store the data with source metadata for BuildProfile
      const dataWithMetadata = {
        ...postData,
        isScheduled,
        source: 'BuildProfile',
        timestamp: Date.now()
      };
      
      console.log('Storing pending post data for BuildProfile:', dataWithMetadata);
      sessionStorage.setItem('pending_post_data', JSON.stringify(dataWithMetadata));
      
      // Initiate LinkedIn connect which will redirect and come back
      await initiateLinkedInConnect();
      
    } catch (error) {
      console.error('Unexpected error generating LinkedIn post:', error);
      toast.error('Failed to generate LinkedIn post. Please try again.');
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (postContent.trim().length < 10) {
        toast.error('Post content should be at least 10 characters long');
        setIsSubmitting(false);
        return;
      }
      
      const finalNiche = selectedNiche === 'Custom' ? customNiche : selectedNiche;
      
      const postData = {
        content: postContent,
        niche: finalNiche || 'General',
        tone: selectedTone
      };

      await generateLinkedInPost(postData, false);
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create LinkedIn post');
      setIsSubmitting(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduleSubmitting(true);
    
    try {
      if (scheduledContent.trim().length < 10) {
        toast.error('Post content should be at least 10 characters long');
        setIsScheduleSubmitting(false);
        return;
      }
      
      const finalNiche = scheduledNiche === 'Custom' ? scheduledCustomNiche : scheduledNiche;
      
      const postData = {
        content: scheduledContent,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        niche: finalNiche || 'General',
        tone: scheduledTone
      };

      await generateLinkedInPost(postData, true);
      
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error('Failed to schedule LinkedIn post');
      setIsScheduleSubmitting(false);
    }
  };
  
  const handleLinkedInConnect = async () => {
    console.log('User confirmed LinkedIn connection from BuildProfile');
    // The authentication flow is already handled by the hook
  };

  const handleLinkedInDismiss = () => {
    console.log('User dismissed LinkedIn connection from BuildProfile');
    dismissModal();
    setIsSubmitting(false);
    setIsScheduleSubmitting(false);
    setIsGenerating(false);
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
  
  const handleNicheSelect = (niche: string) => {
    if (niche === selectedNiche) {
      setSelectedNiche('');
    } else {
      setSelectedNiche(niche);
      if (niche !== 'Custom') {
        setCustomNiche('');
      }
    }
  };
  
  const handleScheduledNicheSelect = (niche: string) => {
    if (niche === scheduledNiche) {
      setScheduledNiche('');
    } else {
      setScheduledNiche(niche);
      if (niche !== 'Custom') {
        setScheduledCustomNiche('');
      }
    }
  };
  
  return (
    <div>
      <Header 
        title="Build Your Profile" 
        subtitle="Create and schedule AI-powered LinkedIn posts to build your professional brand."
      />
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="create" className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Create Post</TabsTrigger>
          <TabsTrigger value="scheduled" className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Scheduled Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          <div className="glass-card p-6 hover:shadow-lg transition-all duration-300">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium mb-2">
                    Select Niche
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {niches.map((niche) => (
                      <div 
                        key={niche}
                        onClick={() => handleNicheSelect(niche)} 
                        className={`
                          p-3 rounded-lg border-2 cursor-pointer text-center
                          transition-all duration-200 hover:bg-primary-100/10
                          ${selectedNiche === niche ? 'border-primary bg-primary-100/20' : 'border-gray-200'}
                        `}
                      >
                        {niche}
                        {selectedNiche === niche && (
                          <Check className="inline ml-1 h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                    <div 
                      onClick={() => handleNicheSelect('Custom')}
                      className={`
                        p-3 rounded-lg border-2 cursor-pointer text-center
                        transition-all duration-200 hover:bg-primary-100/10
                        ${selectedNiche === 'Custom' ? 'border-primary bg-primary-100/20' : 'border-gray-200'}
                      `}
                    >
                      Custom
                      {selectedNiche === 'Custom' && (
                        <Check className="inline ml-1 h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                  
                  {selectedNiche === 'Custom' && (
                    <div className="mt-3">
                      <Input 
                        placeholder="Enter your custom niche" 
                        value={customNiche} 
                        onChange={(e) => setCustomNiche(e.target.value)}
                        className="focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-2">
                    Select Tone
                  </label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-primary/30 transition-all duration-200">
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone} value={tone} className="hover:bg-primary-100/10 cursor-pointer">
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-2">
                    Post Content Prompt
                  </label>
                  <Textarea
                    placeholder="Explain in your words what you want to convey to the users. Our AI will generate a comprehensive LinkedIn post using latest industry trends and relevant images."
                    className="min-h-[200px] focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <div className="text-xs text-text-200 mt-1 flex justify-between">
                    <span>{postContent.length} characters</span>
                    <span className={postContent.length < 10 ? "text-red-500" : "text-green-500"}>
                      (minimum 10 characters)
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenScheduleDialog(true)}
                    className="hover:bg-gray-100 transition-all duration-200 hover:shadow group"
                  >
                    <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    Schedule for Later
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isGenerating}
                    className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    {isSubmitting || isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating AI Post...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        Generate & Post Now
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
                <div key={post.id} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <div className="text-sm font-medium text-primary-100 px-2 py-1 rounded bg-primary-100/10">
                        {post.niche}
                      </div>
                      <div className="text-sm font-medium text-purple-700 px-2 py-1 rounded bg-purple-100">
                        {post.tone}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.posted ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                          <Check size={12} className="mr-1" />
                          Posted
                        </span>
                      ) : post.scheduled_date ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full flex items-center">
                          <Clock size={12} className="mr-1" />
                          Scheduled
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                          <ThumbsUp size={12} className="mr-1" />
                          Draft
                        </span>
                      )}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-all duration-200"
                      >
                        <Trash2 size={16} className="text-gray-500 hover:text-red-500 transition-colors" />
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
                        className="hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
                      >
                        Mark as Posted
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 glass-card">
                <p className="text-text-200">No posts yet. Create your first AI-powered LinkedIn post!</p>
                <Button
                  variant="outline"
                  className="mt-4 hover:bg-gray-100 transition-all duration-200 group"
                  onClick={() => setOpenScheduleDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
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
            <DialogTitle>Schedule AI LinkedIn Post</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleScheduleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-lg font-medium mb-2">
                  Select Niche
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {niches.map((niche) => (
                    <div 
                      key={niche}
                      onClick={() => handleScheduledNicheSelect(niche)} 
                      className={`
                        p-3 rounded-lg border-2 cursor-pointer text-center text-sm
                        transition-all duration-200 hover:bg-primary-100/10
                        ${scheduledNiche === niche ? 'border-primary bg-primary-100/20' : 'border-gray-200'}
                      `}
                    >
                      {niche}
                      {scheduledNiche === niche && (
                        <Check className="inline ml-1 h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                  <div 
                    onClick={() => handleScheduledNicheSelect('Custom')}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer text-center text-sm
                      transition-all duration-200 hover:bg-primary-100/10
                      ${scheduledNiche === 'Custom' ? 'border-primary bg-primary-100/20' : 'border-gray-200'}
                    `}
                  >
                    Custom
                    {scheduledNiche === 'Custom' && (
                      <Check className="inline ml-1 h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
                
                {scheduledNiche === 'Custom' && (
                  <div className="mt-3">
                    <Input 
                      placeholder="Enter your custom niche" 
                      value={scheduledCustomNiche} 
                      onChange={(e) => setScheduledCustomNiche(e.target.value)}
                      className="focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-lg font-medium mb-2">
                  Select Tone
                </label>
                <Select value={scheduledTone} onValueChange={setScheduledTone}>
                  <SelectTrigger className="focus:ring-2 focus:ring-primary/30 transition-all duration-200">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone} className="hover:bg-primary-100/10 cursor-pointer">
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-lg font-medium mb-2">
                  Post Content Prompt
                </label>
                <Textarea
                  placeholder="Explain in your words what you want to convey to the users. Our AI will generate a comprehensive LinkedIn post using latest industry trends and relevant images."
                  className="min-h-[150px] focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                  value={scheduledContent}
                  onChange={(e) => setScheduledContent(e.target.value)}
                />
                <div className="text-xs text-text-200 mt-1 flex justify-between">
                  <span>{scheduledContent.length} characters</span>
                  <span className={scheduledContent.length < 10 ? "text-red-500" : "text-green-500"}>
                    (minimum 10 characters)
                  </span>
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
                        className="w-full justify-start text-left font-normal focus:ring-2 focus:ring-primary/30 transition-all duration-200"
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
                        className="rounded-md border shadow-md"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Schedule Time
                  </label>
                  <Select value={scheduledTime || ''} onValueChange={setScheduledTime}>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary/30 transition-all duration-200">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <React.Fragment key={hour}>
                          <SelectItem value={`${hour}:00`} className="hover:bg-primary-100/10 cursor-pointer">
                            {hour === 0 ? '12:00 AM' : 
                             hour < 12 ? `${hour}:00 AM` : 
                             hour === 12 ? '12:00 PM' : 
                             `${hour - 12}:00 PM`}
                          </SelectItem>
                          <SelectItem value={`${hour}:30`} className="hover:bg-primary-100/10 cursor-pointer">
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
              <Button 
                type="submit" 
                disabled={isScheduleSubmitting || isGenerating}
                className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                {isScheduleSubmitting || isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling AI Post...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule AI Post
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
            <DialogDescription>
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Check className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setSuccessModal(false)}
              className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-md w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LinkedIn Prompt Modal */}
      <LinkedInPromptModal
        isOpen={showModal}
        onConnect={handleLinkedInConnect}
        onDismiss={handleLinkedInDismiss}
      />
    </div>
  );
};

export default BuildProfile;
