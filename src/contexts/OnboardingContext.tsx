import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed, user_role, plan_type, trial_start_date')
          .eq('id', user.id)
          .single();

        if (profile && !profile.onboarding_completed) {
          // User hasn't completed onboarding, show modal
          setIsOpen(true);
          setOnboardingData({
            role: profile.user_role || null,
            plan: profile.plan_type || null,
            trialStartDate: profile.trial_start_date ? new Date(profile.trial_start_date) : undefined,
            onboardingCompleted: false
          });
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
      const updateData: any = {
        onboarding_completed: true,
        user_role: data.role,
        plan_type: data.plan,
        updated_at: new Date().toISOString()
      };

      // Set trial start date for paid plans
      if (data.plan !== 'free' && data.trialStartDate) {
        updateData.trial_start_date = data.trialStartDate.toISOString();
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

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
