import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Send, Loader2, Check, Edit3, Linkedin } from 'lucide-react';
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

// Enum to manage stages
enum PostStage {
  Idle, // Initial state, ready to generate draft
  GeneratingDraft,
  DraftReady, // Draft generated, ready for editing
  PostingToLinkedIn,
  PostSuccessful
}

const BuildProfile: React.FC = () => {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [postContent, setPostContent] = useState(''); // Will hold user input OR generated draft
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedPostForModal, setGeneratedPostForModal] = useState(''); // For success modal display
  const [linkedInPostId, setLinkedInPostId] = useState<string | null>(null); // Store LinkedIn post ID for direct linking

  const [currentStage, setCurrentStage] = useState<PostStage>(PostStage.Idle);
  
  const { showModal, initiateLinkedInConnect, dismissModal, hasLinkedInToken, recheckToken } = useLinkedInPrompt();
  const { userThemes, loading: themesLoading } = useThemes();

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

  // Handle LinkedIn connection callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedInConnected = urlParams.get('linkedin_connected');
    
    if (linkedInConnected === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);
      const pendingPostDataString = sessionStorage.getItem('pending_post_data');
      if (pendingPostDataString) {
        try {
          const pendingData = JSON.parse(pendingPostDataString);
          if (pendingData.source === 'BuildProfile') { 
            sessionStorage.removeItem('pending_post_data');
            setTimeout(() => {
              processFinalLinkedInPost(pendingData.payload);
            }, 2000);
          } else {
            console.warn('BuildProfile: LinkedIn connected, but session data source mismatch.', pendingData.source);
            toast.info('LinkedIn reconnected, but previous action data was not for this page.');
          }
        } catch (error) {
          console.error('Error parsing pending post data:', error);
          toast.error('Failed to process post data after LinkedIn connection');
        }
      } else {
        toast.success('LinkedIn connected successfully!');
        // Recheck token status after connection
        setTimeout(() => {
          recheckToken();
        }, 1000);
      }
    }
  }, [recheckToken]);

  const processFinalLinkedInPost = async (postData: any) => {
    try {
      console.log('Processing FINAL LinkedIn post with data:', postData);
      setCurrentStage(PostStage.PostingToLinkedIn);
      
      // First, let's refresh the token to ensure we have a valid one
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in again');
        setCurrentStage(PostStage.DraftReady);
        return;
      }

      // Validate required fields before making the request
      if (!postData.content || !postData.niche || !postData.tone) {
        console.error('Missing required fields:', postData);
        toast.error('Missing required fields for LinkedIn post');
        setCurrentStage(PostStage.DraftReady);
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-linkedin-post', {
        body: {
          niche: postData.niche,
          tone: postData.tone,
          contentPrompt: postData.content,  // This was the issue - we need to use contentPrompt
          scheduleDate: null,
          scheduleTime: null
        }
      });

      if (error) {
        console.error('LinkedIn post function invocation error:', error);
        toast.error('Failed to connect to LinkedIn. Please try again.');
        setCurrentStage(PostStage.DraftReady);
        initiateFinalLinkedInPost(postData);
        return;
      }

      if (data?.error) {
        console.error('LinkedIn post generation failed:', data.error, data.message);
        
        // Check for specific error types
        if (data.error === 'LINKEDIN_TOKEN_REVOKED' || 
            data.error.includes('token') || 
            data.error.includes('REVOKED_ACCESS_TOKEN') ||
            data.message?.includes('token') ||
            data.message?.includes('revoked') ||
            data.message?.includes('reconnect')) {
          
          console.log('LinkedIn token issue detected, initiating re-authentication...');
          toast.error('LinkedIn authentication required. Please reconnect your account.');
          setCurrentStage(PostStage.DraftReady);
          initiateFinalLinkedInPost(postData);
          return;
        }

        // Handle OpenAI errors
        if (data.error.includes('OpenAI') || data.message?.includes('OpenAI')) {
          toast.error('Failed to generate post content. Please try again.');
          setCurrentStage(PostStage.DraftReady);
          return;
        }
        
        // Handle LinkedIn API errors
        if (data.error.includes('Failed to post to LinkedIn')) {
          toast.error('Failed to post to LinkedIn. Please try again later.');
          setCurrentStage(PostStage.DraftReady);
          return;
        }
        
        // Generic error
        toast.error(`Failed to generate LinkedIn post: ${data.message || data.error}`);
        setCurrentStage(PostStage.DraftReady);
        return;
      }

      console.log('LinkedIn post generation successful:', data);
      setGeneratedPostForModal(data.content || 'Your LinkedIn post has been published successfully!');
      
      // Store LinkedIn post ID for direct linking if available
      if (data.linkedinPostId) {
        setLinkedInPostId(data.linkedinPostId);
        console.log('LinkedIn post ID stored:', data.linkedinPostId);
      } else {
        setLinkedInPostId(null);
        console.log('No LinkedIn post ID available in response');
      }
      
      const updatedPosts = await linkedinService.getPosts();
      setPosts(updatedPosts);
      
      setPostContent(''); 
      setCurrentStage(PostStage.PostSuccessful);
      setSuccessMessage('Your LinkedIn post has been published successfully!');
      setSuccessModal(true);
      
    } catch (error) {
      console.error('Error processing final LinkedIn post:', error);
      toast.error('Failed to process LinkedIn post. Please try again.');
      setCurrentStage(PostStage.DraftReady);
    }
  };

  const initiateFinalLinkedInPost = async (finalPostData: any) => {
    console.log('Starting FINAL LinkedIn post process - prompting for fresh authentication...');
    
    setCurrentStage(PostStage.PostingToLinkedIn);
    try {
      await initiateLinkedInConnect({ 
        postData: finalPostData, 
        callbackSource: 'BuildProfile' 
      });
    } catch (error) {
      console.error('Error initiating final LinkedIn post:', error);
      toast.error('Failed to start LinkedIn posting process. Please try again.');
      setCurrentStage(PostStage.DraftReady);
    }
  };
  
  const tones = [
    'Professional', 'Inspirational', 'Conversational', 'Thoughtful',
    'Celebratory', 'Educational', 'Motivational'
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedThemeId) {
      toast.error('Please select a Theme');
      return;
    }
    if (!selectedTone) {
      toast.error('Please select a Tone');
      return;
    }

    const selectedThemeObj = userThemes.find(userTheme => userTheme.theme.id === selectedThemeId);
    if (!selectedThemeObj) {
        toast.error('Selected theme not found. Please try again.');
        return;
    }

    if (currentStage === PostStage.Idle || currentStage === PostStage.PostSuccessful) {
      if (postContent.trim().length > 2000) {
        toast.error('Initial content ideas should be less than 2000 characters.');
        return;
      }
      setCurrentStage(PostStage.GeneratingDraft);
      try {
        const { data, error } = await supabase.functions.invoke('generate-draft-linkedin-post', {
          body: {
            themeId: selectedThemeId,
            tone: selectedTone,
            userInput: postContent,
          }
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        setPostContent(data.draftContent);
        toast.success('Draft generated! You can now edit it below.');
        setCurrentStage(PostStage.DraftReady);

      } catch (err: any) {
        console.error('Error generating draft:', err);
        toast.error(`Failed to generate draft: ${err.message || 'Unknown error'}`);
        setCurrentStage(PostStage.Idle);
      }

    } else if (currentStage === PostStage.DraftReady) {
      if (!postContent || postContent.trim().length < 10) {
        toast.error('Post content is too short.');
        return;
      }
      const finalPostData = {
        contentPrompt: postContent.trim(),  // Changed from content to contentPrompt
        niche: selectedThemeObj.theme.title,
        tone: selectedTone
      };
      await initiateFinalLinkedInPost(finalPostData);
    }
  };

  const handleLinkedInConnect = async () => {
    console.log('User confirmed LinkedIn connection from BuildProfile');
  };

  const handleLinkedInDismiss = () => {
    dismissModal();
    if (currentStage === PostStage.PostingToLinkedIn) {
      setCurrentStage(PostStage.DraftReady);
    } else if (currentStage === PostStage.GeneratingDraft) {
      setCurrentStage(PostStage.Idle);
    }
  };

  const getButtonTextAndIcon = () => {
    switch (currentStage) {
      case PostStage.Idle:
      case PostStage.PostSuccessful:
        return { text: 'Generate Draft Post', icon: <Edit3 className="h-5 w-5" /> };
      case PostStage.GeneratingDraft:
        return { text: 'Generating Draft...', icon: <Loader2 className="h-5 w-5 animate-spin" /> };
      case PostStage.DraftReady:
        return { text: 'Post to LinkedIn', icon: <Linkedin className="h-5 w-5" /> };
      case PostStage.PostingToLinkedIn:
        return { text: 'Connecting to LinkedIn...', icon: <Loader2 className="h-5 w-5 animate-spin" /> };
      default:
        return { text: 'Generate Draft Post', icon: <Edit3 className="h-5 w-5" /> };
    }
  };

  const buttonState = getButtonTextAndIcon();
  
  return (
    <div className="p-4 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <LinkedInPromptModal
        isOpen={showModal}
        onConnect={handleLinkedInConnect} 
        onDismiss={handleLinkedInDismiss}
      />

      <Dialog open={successModal} onOpenChange={(isOpen) => {
        setSuccessModal(isOpen);
        if (!isOpen) {
            setCurrentStage(PostStage.Idle);
            setPostContent('');
            setSelectedThemeId('');
            setSelectedTone('');
            setLinkedInPostId(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Check className="h-6 w-6 text-green-600" />
              Success!
            </DialogTitle>
            <DialogDescription className="text-base">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl">
                <Linkedin className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Post Published!</h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
              Your content has been successfully published to your LinkedIn profile
            </p>
          </div>
          
          {generatedPostForModal && (
            <div className="mt-2 p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Your LinkedIn Post</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
                </div>
              </div>
              <div className="pl-12">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{generatedPostForModal}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-4">
            <a 
              href={linkedInPostId ? `https://www.linkedin.com/feed/update/${linkedInPostId}` : "https://www.linkedin.com/feed/"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              <Linkedin className="h-5 w-5" />
              {linkedInPostId ? "View Your Post on LinkedIn" : "Go to LinkedIn Feed"}
            </a>
            <Button 
              onClick={() => setSuccessModal(false)}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto">
        <div className="text-right mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Rewrites: </span>
          <span className="font-semibold text-blue-600">2 / 2</span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3">
               <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-full flex items-center justify-center h-10 w-10 text-lg font-bold shadow">
                {currentStage === PostStage.Idle || currentStage === PostStage.GeneratingDraft || currentStage === PostStage.PostSuccessful ? '1' : '2'}
              </span>
              {currentStage === PostStage.Idle || currentStage === PostStage.GeneratingDraft || currentStage === PostStage.PostSuccessful ? 'Generate LinkedIn Post Draft' : 'Review & Publish Post'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Theme <span className="text-red-500">*</span>
              </label>
              <Select 
                value={selectedThemeId} 
                onValueChange={setSelectedThemeId} 
                disabled={themesLoading || currentStage === PostStage.GeneratingDraft || currentStage === PostStage.PostingToLinkedIn}
              >
                <SelectTrigger id="theme-select" className="w-full py-2.5 px-3 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Select an Owned Theme" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  {themesLoading ? (
                    <SelectItem value="loading" disabled>Loading your themes...</SelectItem>
                  ) : userThemes.length > 0 ? (
                    userThemes.map((userTheme) => (
                      <SelectItem key={userTheme.theme.id} value={userTheme.theme.id} className="text-gray-900 dark:text-gray-100">
                        {userTheme.theme.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-themes" disabled>No themes. Add some from the Themes page.</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="tone-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Desired Tone <span className="text-red-500">*</span>
              </label>
              <Select 
                value={selectedTone} 
                onValueChange={setSelectedTone}
                disabled={currentStage === PostStage.GeneratingDraft || currentStage === PostStage.PostingToLinkedIn}
              >
                <SelectTrigger id="tone-select" className="w-full py-2.5 px-3 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Select a tone for your post" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  {tones.map((tone) => (
                    <SelectItem key={tone} value={tone} className="text-gray-900 dark:text-gray-100">
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="content-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {currentStage === PostStage.Idle || currentStage === PostStage.GeneratingDraft || currentStage === PostStage.PostSuccessful ? 'Initial Ideas / Content (Optional)' : 'Generated Draft (Editable)'}
              </label>
              <Textarea
                id="content-input"
                placeholder={
                  currentStage === PostStage.Idle || currentStage === PostStage.GeneratingDraft || currentStage === PostStage.PostSuccessful 
                  ? "Optionally, provide some initial ideas, key points, or a snippet of your article. The AI will use this along with the selected theme's style to generate a draft."
                  : "Review and edit the generated draft below. When you're satisfied, click 'Post to LinkedIn'."
                }
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out shadow-sm min-h-[120px]"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                disabled={currentStage === PostStage.GeneratingDraft || currentStage === PostStage.PostingToLinkedIn}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {currentStage === PostStage.Idle || currentStage === PostStage.GeneratingDraft || currentStage === PostStage.PostSuccessful 
                ? "If left blank, a post will be generated based solely on the theme's sample content and selected tone."
                : "Make any necessary adjustments to the text, formatting, and hashtags before publishing."}
              </p>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                disabled={currentStage === PostStage.GeneratingDraft || currentStage === PostStage.PostingToLinkedIn || (!selectedThemeId && currentStage !== PostStage.DraftReady) || (!selectedTone && currentStage !== PostStage.DraftReady)}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 sm:px-10 py-3 rounded-lg font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
              >
                {buttonState.icon}
                {buttonState.text}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuildProfile;
