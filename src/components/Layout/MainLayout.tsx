
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useLinkedInPrompt } from '@/hooks/useLinkedInPrompt';
import LinkedInPromptModal from '@/components/UI/LinkedInPromptModal';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-text-100 dark:text-dark-text-100">{title}</h1>
      {subtitle && <p className="text-text-200 mt-1 dark:text-dark-text-200">{subtitle}</p>}
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const {
    isCheckingToken,
    hasLinkedInToken,
    showModal,
    initiateLinkedInConnect,
    dismissModal
  } = useLinkedInPrompt();
  
  useEffect(() => {
    console.log('🏠 MainLayout rendered, authenticated:', isAuthenticated, 'loading:', isLoading, 'path:', location.pathname);
    console.log('🔗 LinkedIn token status:', hasLinkedInToken, 'show modal:', showModal);
  }, [isAuthenticated, isLoading, location.pathname, hasLinkedInToken, showModal]);
  
  // If still loading auth state, show loading
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center dark:bg-black">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-medium dark:text-dark-text-100">
            Loading your workspace...
          </div>
        </div>
      </div>
    );
  }
  
  // Auth checks are now handled by ProtectedRouteHandler in App.tsx
  return (
    <div className="flex h-screen bg-bg-200 overflow-hidden dark:bg-black">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </div>

      {/* LinkedIn Connection Prompt Modal */}
      <LinkedInPromptModal
        isOpen={showModal}
        onConnect={initiateLinkedInConnect}
        onDismiss={dismissModal}
      />
    </div>
  );
};

export default MainLayout;
