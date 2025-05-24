
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const LinkedInTokenCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing LinkedIn connection...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('LinkedIn callback page loaded');
        console.log('Current URL:', window.location.href);
        
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        console.log('URL parameters:', { code: !!code, state, error, errorDescription });

        // Check for LinkedIn OAuth errors
        if (error) {
          console.error('LinkedIn OAuth error:', error, errorDescription);
          setStatus('error');
          setMessage(`LinkedIn authorization failed: ${errorDescription || error}`);
          toast.error('LinkedIn connection failed');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          console.error('Missing code or state parameter', { code: !!code, state: !!state });
          setStatus('error');
          setMessage('Invalid callback parameters from LinkedIn.');
          toast.error('LinkedIn connection failed - missing parameters');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        // Verify state matches what we stored
        const storedState = sessionStorage.getItem('linkedin_oauth_state');
        console.log('State verification:', { received: state, stored: storedState });
        
        if (state !== storedState) {
          console.error('State mismatch - possible CSRF attack', { received: state, stored: storedState });
          setStatus('error');
          setMessage('Security validation failed - state mismatch.');
          toast.error('LinkedIn connection failed - security error');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        // Clean up stored state
        sessionStorage.removeItem('linkedin_oauth_state');

        // Get current user session
        console.log('Getting user session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('error');
          setMessage('Authentication error. Please log in again.');
          toast.error('Please log in to connect LinkedIn');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!session) {
          console.error('No valid session found');
          setStatus('error');
          setMessage('No valid session. Please log in first.');
          toast.error('Please log in to connect LinkedIn');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        console.log('Valid session found, user ID:', session.user.id);

        // Send code to our edge function
        console.log('Sending authorization code to edge function...');
        const response = await fetch(
          'https://bzddkmmjqwgylckimwiq.supabase.co/functions/v1/linkedin-token-store',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          }
        );

        console.log('Edge function response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Token store failed:', response.status, errorText);
          setStatus('error');
          setMessage('Failed to connect LinkedIn account. Please try again.');
          toast.error('LinkedIn connection failed');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        const result = await response.json();
        console.log('LinkedIn connection successful:', result);

        setStatus('success');
        setMessage('LinkedIn connected successfully!');
        toast.success('LinkedIn account connected for posting');
        
        // Redirect to dashboard after success
        setTimeout(() => navigate('/dashboard'), 2000);

      } catch (error) {
        console.error('Error handling LinkedIn callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred.');
        toast.error('LinkedIn connection failed');
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-16 w-16 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-600" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {status === 'loading' && 'Connecting LinkedIn...'}
            {status === 'success' && 'Connection Successful!'}
            {status === 'error' && 'Connection Failed'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          {status === 'loading' && (
            <div className="text-sm text-gray-500">
              Please wait while we establish the connection...
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-sm text-gray-500">
              You will be redirected to your dashboard shortly.
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-sm text-gray-500">
              You will be redirected back shortly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedInTokenCallback;
