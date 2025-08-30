import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowLeft, Linkedin, Share2, Copy, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { toast } from 'sonner';
import { linkedinService } from '@/services/linkedinService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/UI/dialog';

const PostSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [postContent, setPostContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [linkedinProfileUrl, setLinkedinProfileUrl] = useState<string>('');

  useEffect(() => {
    // Try to get the post content from session storage
    const storedPost = sessionStorage.getItem('successful_linkedin_post');
    
    if (storedPost) {
      setPostContent(storedPost);
      sessionStorage.removeItem('successful_linkedin_post'); // Clear after retrieving
      setIsLoading(false);
    } else {
      // If no stored post, fetch the most recent one
      const fetchLatestPost = async () => {
        try {
          const posts = await linkedinService.getPosts();
          if (posts && posts.length > 0) {
            setPostContent(posts[0].content);
          }
        } catch (error) {
          console.error('Error fetching LinkedIn posts:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchLatestPost();
    }

    // Try to get LinkedIn profile URL from session storage
    const storedProfileUrl = sessionStorage.getItem('linkedin_profile_url');
    if (storedProfileUrl) {
      setLinkedinProfileUrl(storedProfileUrl);
      sessionStorage.removeItem('linkedin_profile_url');
    }
  }, []);

  const handleCopyToClipboard = () => {
    if (postContent) {
      navigator.clipboard.writeText(postContent)
        .then(() => toast.success('Post copied to clipboard!'))
        .catch(() => toast.error('Failed to copy post'));
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCreateNewPost = () => {
    navigate('/build-profile');
  };

  const handlePreviewPost = () => {
    setShowPreviewModal(true);
  };

  const handleOpenLinkedInProfile = () => {
    const profileUrl = linkedinProfileUrl || 'https://www.linkedin.com/feed/';
    window.open(profileUrl, '_blank');
  };

  const handleOpenLinkedInFeed = () => {
    window.open('https://www.linkedin.com/feed/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-8">
      {/* LinkedIn Post Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-blue-600" />
              LinkedIn Post Preview
            </DialogTitle>
            <DialogDescription>
              This is how your post appears on LinkedIn
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            {/* LinkedIn Post Preview */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* LinkedIn Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">Y</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Your Name</div>
                    <div className="text-sm text-gray-500">Just now • 🌐</div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Post Content */}
              <div className="p-4">
                <div className="text-gray-900 whitespace-pre-line leading-relaxed">
                  {postContent || "Your LinkedIn post content will appear here..."}
                </div>
              </div>
              
              {/* LinkedIn Footer */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Like</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Comment</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Repost</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Send</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setShowPreviewModal(false)}
            >
              Close
            </Button>
            <Button 
              onClick={handleOpenLinkedInFeed}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on LinkedIn
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Check className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Post Published Successfully!</h1>
            <p className="text-green-100 text-lg">
              Your LinkedIn post has been created and published to your profile
            </p>
          </div>

          {/* Post Content */}
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <Linkedin className="mr-2 h-5 w-5" /> 
                  LinkedIn Post Content
                </h2>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePreviewPost}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                {isLoading ? (
                  <div className="animate-pulse flex flex-col space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {postContent || "Your post has been published successfully to LinkedIn!"}
                  </p>
                )}
              </div>
            </div>

            {/* LinkedIn Profile Link */}
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                  <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">View on LinkedIn</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Your post is now live on your LinkedIn profile
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={handleOpenLinkedInProfile}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleOpenLinkedInFeed}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Feed
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleBackToDashboard}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                onClick={handleCreateNewPost}
              >
                Create Another Post
              </Button>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Tips for LinkedIn Engagement</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full mt-1">
                <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Respond to comments promptly to boost engagement
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full mt-1">
                <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Share your post with relevant groups and connections
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full mt-1">
                <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Post during peak hours (Tuesday to Thursday, 8am-2pm) for maximum visibility
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostSuccess;
