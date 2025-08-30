import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowLeft, Linkedin, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { toast } from 'sonner';
import { linkedinService } from '@/services/linkedinService';

const PostSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [postContent, setPostContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-8">
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
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">View on LinkedIn</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Your post is now live on your LinkedIn profile
                  </p>
                </div>
                <Button 
                  className="ml-auto bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open('https://www.linkedin.com/feed/', '_blank')}
                >
                  Open LinkedIn
                </Button>
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
