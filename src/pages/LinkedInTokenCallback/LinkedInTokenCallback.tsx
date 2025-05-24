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

        console.log('URL parameters:', { 
          code: code ? `${code.substring(0, 10)}...` : null, 
          state, 
          error, 
          errorDescription 
        });

        // Check for LinkedIn OAuth errors first
        if (error) {
          console.error('LinkedIn OAuth error:', error, errorDescription);
          setStatus('error');
          let errorMsg = 'LinkedIn authorization failed';
          
          if (error === 'access_denied') {
            errorMsg = 'LinkedIn access denied. Please try again and approve the connection.';
          } else if (error === 'invalid_request') {
            errorMsg = 'Invalid LinkedIn request. Please check your configuration.';
          } else if (errorDescription) {
            errorMsg = `LinkedIn error: ${errorDescription}`;
          }
          
          setMessage(errorMsg);
          toast.error(errorMsg);
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        // Validate required parameters
        if (!code) {
          console.error('Missing authorization code');
          setStatus('error');
          setMessage('Missing authorization code from LinkedIn.');
          toast.error('LinkedIn connection failed - missing authorization code');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        if (!state) {
          console.error('Missing state parameter');
          setStatus('error');
          setMessage('Missing state parameter from LinkedIn.');
          toast.error('LinkedIn connection failed - missing state parameter');
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
        console.log('Sending authorization code to edge function...');
        
        // Call the edge function with explicit POST method and proper headers
        console.log('Calling edge function with code:', code.substring(0, 10) + '...');
        
        const functionUrl = `https://bzddkmmjqwgylckimwiq.supabase.co/functions/v1/linkedin-token-store`;
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZGRrbW1qcXdneWxja2ltd2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDUyNTIsImV4cCI6MjA2MzI4MTI1Mn0.TJ-WarxEHdsEbsychuwRHaKDtWQcWK3Yl5-zqAO4Ow0'
          },
          body: JSON.stringify({ code })
        });

        console.log('Function response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Function call failed:', response.status, errorText);
          setStatus('error');
          setMessage(`Failed to connect LinkedIn: HTTP ${response.status}`);
          toast.error(`LinkedIn connection failed: HTTP ${response.status}`);
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        const functionResponse = await response.json();
        console.log('Function response data:', functionResponse);

        if (functionResponse?.error) {
          console.error('Function response error:', functionResponse.error);
          setStatus('error');
          setMessage(`Failed to connect LinkedIn: ${functionResponse.error}`);
          toast.error(`LinkedIn connection failed: ${functionResponse.error}`);
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        console.log('LinkedIn connection successful:', functionResponse);

        setStatus('success');
        setMessage('LinkedIn connected successfully!');
        toast.success('LinkedIn account connected for posting');
        
        // Redirect to dashboard after success
        setTimeout(() => navigate('/dashboard'), 2000);

      } catch (error) {
        console.error('Error handling LinkedIn callback:', error);
        setStatus('error');
        setMessage(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
