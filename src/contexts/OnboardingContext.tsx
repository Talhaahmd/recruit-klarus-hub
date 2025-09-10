import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { onboardingService } from '@/services/onboardingService';
import { toast } from 'sonner';
import type { 
  OnboardingContextType, 
  OnboardingData, 
  OnboardingStep, 
  UserRole, 
  PlanType 
} from '@/types/onboarding';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user || !isAuthenticated) return;

      try {
        const data = await onboardingService.getOnboardingStatus(user.id);
        
        if (data && !data.onboardingCompleted) {
          // User hasn't completed onboarding, show modal
          setIsOpen(true);
          setOnboardingData(data);
          setSelectedRole(data.role);
          setSelectedPlan(data.plan);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, [user, isAuthenticated]);

  const openOnboarding = () => {
    setIsOpen(true);
    setCurrentStep('role');
    setSelectedRole(null);
    setSelectedPlan(null);
  };

  const closeOnboarding = () => {
    setIsOpen(false);
    setCurrentStep('role');
    setSelectedRole(null);
    setSelectedPlan(null);
  };

  const nextStep = () => {
    if (currentStep === 'role' && selectedRole) {
      setCurrentStep('plan');
    } else if (currentStep === 'plan' && selectedPlan) {
      setCurrentStep('confirmation');
    }
  };

  const previousStep = () => {
    if (currentStep === 'plan') {
      setCurrentStep('role');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('plan');
    }
  };

  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      // Use the onboarding service instead of direct database access
      await onboardingService.completeOnboarding(user.id, data);

      setOnboardingData(data);
      setIsOpen(false);
      toast.success('Onboarding completed successfully!');
      
      // Redirect to dashboard or show success message
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast.error(error.message || 'Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const value: OnboardingContextType = {
    currentStep,
    selectedRole,
    selectedPlan,
    onboardingData,
    isOpen,
    isLoading,
    setCurrentStep,
    setSelectedRole,
    setSelectedPlan,
    openOnboarding,
    closeOnboarding,
    completeOnboarding,
    nextStep,
    previousStep
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
