
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useSearchParams } from 'react-router-dom';
import DashboardTabs from '@/components/UI/DashboardTabs';
import PersonalDashboard from './PersonalDashboard';
import HRDashboard from './HRDashboard';
import type { UserRole } from '@/types/onboarding';

// Define a type for our activity items for better type safety
type Activity = {
  id: string;
  type: 'lead' | 'job' | 'application' | 'interview';
  message: string;
  time: string;
  timestamp: Date;
  icon: React.ElementType;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserRole, hasCompletedOnboarding } = useOnboarding();
  const [searchParams] = useSearchParams();
  const [activeRole, setActiveRole] = useState<UserRole>('personal');
  const [loading, setLoading] = useState(true);

  // Initialize role from onboarding data or URL params
  useEffect(() => {
    const urlRole = searchParams.get('role') as UserRole;
    const userRole = getUserRole();
    
    if (urlRole && (urlRole === 'personal' || urlRole === 'hr')) {
      setActiveRole(urlRole);
    } else if (userRole) {
      setActiveRole(userRole);
    } else {
      // Default to personal if no role is set (for testing)
      setActiveRole('personal');
    }
    setLoading(false);
  }, [getUserRole, searchParams]);
  
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
  };


  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Klarus Dashboard
          </h1>
          {user && (
            <h2 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Welcome back, {user.user_metadata?.full_name || user.email || 'User'}!
            </h2>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Viewing as: <span className="font-medium capitalize">{activeRole}</span>
          </p>
        </div>
        
        {/* Role Tabs */}
        <DashboardTabs 
          activeRole={activeRole} 
          onRoleChange={handleRoleChange}
          className="max-w-md"
        />
      </div>

      {/* Role-Based Content */}
      {activeRole === 'personal' ? (
        <PersonalDashboard />
      ) : (
        <HRDashboard />
      )}
    </div>
  );
};

export default Dashboard;
