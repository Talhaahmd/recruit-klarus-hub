import React from 'react';
import { Button } from '@/components/ui/button';
import { LinkedinIcon } from 'lucide-react';
import { linkedinAuthService } from '@/services/linkedinAuthService';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const handleLinkedInLogin = async () => {
    try {
      await linkedinAuthService.signInWithLinkedIn();
    } catch (error) {
      console.error('LinkedIn login error:', error);
      toast.error('Failed to login with LinkedIn. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-100 dark:text-white mb-2">
            Welcome to Klarus Hub
          </h1>
          <p className="text-text-200 dark:text-gray-400">
            Sign in to manage your recruitment process
          </p>
        </div>

        <div className="glass-card p-6">
          <Button
            onClick={handleLinkedInLogin}
            className="w-full flex items-center justify-center gap-2 bg-[#0077B5] hover:bg-[#006097] text-white"
          >
            <LinkedinIcon size={20} />
            Sign in with LinkedIn
          </Button>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-text-200 dark:text-gray-400">
              Your LinkedIn profile will be automatically synchronized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
