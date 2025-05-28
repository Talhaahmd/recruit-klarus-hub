
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useLinkedInPrompt } from '@/hooks/useLinkedInPrompt';
import LinkedInPromptModal from '@/components/UI/LinkedInPromptModal';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-100 dark:text-dark-text-100">{title}</h1>
      {subtitle && <p className="text-text-200 mt-1 dark:text-dark-text-200 text-sm sm:text-base">{subtitle}</p>}
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const {
    isCheckingToken,
    hasLinkedInToken,
    showModal,
    initiateLinkedInConnect,
    dismissModal
  } = useLinkedInPrompt();
  
  useEffect(() => {
    console.log('🏠 MainLayout rendered, authenticated:', isAuthenticated, 'loading:', isLoading, 'path:', location.pathname);
    console.log('🔗 LinkedIn token status:', hasLinkedInToken, 'show modal:', showModal, 'checking:', isCheckingToken);
    console.log(`📌 Sidebar: Pinned=${isPinned}, Desktop=${isDesktop}, MobileOpen=${isMobileMenuOpen}`);
  }, [isAuthenticated, isLoading, location.pathname, hasLinkedInToken, showModal, isCheckingToken, isPinned, isDesktop, isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMobileMenuOpen(false);
        setIsPinned(true);
      } else {
        setIsPinned(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (!isDesktop && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isDesktop]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const togglePinned = () => {
    if (isDesktop) {
      setIsPinned(!isPinned);
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center dark:bg-black px-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-primary-100 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-base sm:text-lg font-medium dark:text-dark-text-100 text-center">
            Loading your workspace...
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-sky-50 overflow-hidden dark:bg-black">
      {/* Mobile Menu Button */}
      {!isDesktop && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>
      )}

      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        isPinned={isPinned}
        isDesktop={isDesktop}
        toggleMobileMenu={toggleMobileMenu}
        togglePinned={togglePinned}
        closeMobileMenu={closeMobileMenu}
      />
      
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out
                      ${isDesktop ? (isPinned ? 'lg:ml-64' : 'lg:ml-20') : 'ml-0'}
                      ${!isDesktop ? 'pt-16' : 'pt-0'}
      `}>
        <div className="min-h-full">
          <Outlet />
        </div>
      </div>

      <LinkedInPromptModal
        isOpen={showModal}
        onConnect={initiateLinkedInConnect}
        onDismiss={dismissModal}
      />
    </div>
  );
};

export default MainLayout;
