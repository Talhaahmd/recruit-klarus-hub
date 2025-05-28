import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Send, Loader2, Check, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/UI/button';
import { Textarea } from '@/components/UI/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/UI/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import { linkedinService, LinkedInPost } from '@/services/linkedinService';
import { useLinkedInPrompt } from '@/hooks/useLinkedInPrompt';
import LinkedInPromptModal from '@/components/UI/LinkedInPromptModal';
import { supabase } from '@/lib/supabase';
import { useThemes, type Theme } from '@/hooks/useThemes';

const BuildProfile: React.FC = () => {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [postContent, setPostContent] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  
  const { showModal, initiateLinkedInConnect, dismissModal, hasLinkedInToken } = useLinkedInPrompt();
  const { themes, loading: themesLoading } = useThemes();

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
            console.log('Processing LinkedIn post generation for BuildProfile...', postData);
            sessionStorage.removeItem('pending_post_data');
            
            // Process the LinkedIn post with delay to ensure token is ready
            setTimeout(() => {
              processLinkedInPost(postData);
            }, 2000);
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
      setIsSubmitting(true);
      
      const { data, error } = await supabase.functions.invoke('generate-linkedin-post', {
        body: {
          niche: postData.niche,
          tone: postData.tone,
          contentPrompt: postData.content,
          scheduleDate: null,
          scheduleTime: null
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
      
      // Set the generated post content
      setGeneratedPost(data.content || 'Your LinkedIn post has been generated successfully!');
      
      // Refresh posts list
      const updatedPosts = await linkedinService.getPosts();
      setPosts(updatedPosts);
      
      // Reset form
      setPostContent('');
      setSelectedThemeId('');
      setSelectedTone('');
      
      // Show success modal
      setSuccessMessage('Your LinkedIn post has been generated successfully!');
      setSuccessModal(true);
      
    } catch (error) {
      console.error('Error processing LinkedIn post:', error);
      toast.error('Failed to process LinkedIn post');
    } finally {
      setIsGenerating(false);
      setIsSubmitting(false);
    }
  };

  const generateLinkedInPost = async (postData: any) => {
    console.log('Starting LinkedIn post generation process...', postData);
    
    // Check if we already have a valid LinkedIn token
    if (hasLinkedInToken === true) {
      console.log('LinkedIn token available, generating post directly...');
      await processLinkedInPost({ ...postData, source: 'BuildProfile' });
      return;
    }
    
    console.log('No LinkedIn token, initiating authentication...');
    setIsGenerating(true);
    
    try {
      // Store the data with source metadata for BuildProfile
      const dataWithMetadata = {
        ...postData,
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
      setIsSubmitting(false);
    }
  };
  
  const tones = [
    'Professional',
    'Inspirational',
    'Conversational',
    'Thoughtful',
    'Celebratory',
    'Educational',
    'Motivational'
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (postContent.trim().length < 10) {
        toast.error('Content should be at least 10 characters long');
        setIsSubmitting(false);
        return;
      }

      if (!selectedThemeId) {
        toast.error('Please select a Theme');
        setIsSubmitting(false);
        return;
      }

      if (!selectedTone) {
        toast.error('Please select a tone');
        setIsSubmitting(false);
        return;
      }
      
      const selectedThemeObj = themes.find(theme => theme.id === selectedThemeId);
      if (!selectedThemeObj) {
          toast.error('Selected theme not found. Please try again.');
          setIsSubmitting(false);
          return;
      }

      const postData = {
        content: postContent,
        niche: selectedThemeObj.title,
        tone: selectedTone
      };

      await generateLinkedInPost(postData);
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create LinkedIn post');
      setIsSubmitting(false);
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
    setIsGenerating(false);
  };
  
  return (
    <div className="p-4 lg:p-8 min-h-screen bg-gray-50">
      {/* LinkedIn Prompt Modal */}
      <LinkedInPromptModal
        isOpen={showModal}
        onConnect={handleLinkedInConnect} 
        onDismiss={handleLinkedInDismiss}
      />

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
          {generatedPost && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">{generatedPost}</p>
            </div>
          )}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => setSuccessModal(false)}
              className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-md w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto">
        <div className="text-right mb-4">
          <span className="text-sm text-gray-600">Remaining Rewrites: </span>
          <span className="font-semibold text-blue-600">2 / 2</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">1</span>
              Convert your content into LinkedIn posts
            </h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <span className="sr-only">Copy</span>
                📋
              </Button>
              <Button variant="ghost" size="sm">
                <span className="sr-only">Chat</span>
                💬
              </Button>
              <Button variant="ghost" size="sm">
                <span className="sr-only">Refresh</span>
                🔄
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Theme
              </label>
              <Select value={selectedThemeId} onValueChange={setSelectedThemeId} disabled={themesLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Theme" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {themesLoading ? (
                    <SelectItem value="loading" disabled>Loading themes...</SelectItem>
                  ) : (
                    themes.map((theme: Theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <div className="flex items-center mt-2">
                <Button variant="ghost" size="sm" type="button">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Textarea
                  placeholder="Paste your newsletter here"
                  className="min-h-[300px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  LinkedIn post will appear here after you generate it
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tone
                </label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div></div>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || isGenerating}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
              >
                {isSubmitting || isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating LinkedIn Posts...
                  </>
                ) : (
                  'Generate LinkedIn Posts'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuildProfile;
