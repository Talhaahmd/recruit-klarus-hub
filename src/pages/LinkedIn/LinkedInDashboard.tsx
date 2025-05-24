
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import BuildProfile from '@/pages/BuildProfile/BuildProfile';

const LinkedInDashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-medium text-white">
            Loading LinkedIn Zero...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/linkedin-login" replace />;
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img 
                className="w-auto h-8" 
                src="/lovable-uploads/67d45eae-154d-4a02-a7a5-1f115188b97b.png" 
                alt="Klarus HR Logo" 
              />
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                LinkedIn Zero
              </span>
            </div>
            <div className="text-sm text-gray-400">
              AI-Powered LinkedIn Content Creation
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-lg p-8">
          <BuildProfile />
        </div>
      </main>
    </div>
  );
};

export default LinkedInDashboard;
