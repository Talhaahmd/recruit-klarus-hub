import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/UI/dialog';
import { Button } from '@/components/UI/button';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import RoleSelectionCard from './RoleSelectionCard';
import PlanSelectionCard from './PlanSelectionCard';
import { cn } from '@/lib/utils';
import type { RoleOption, PlanOption } from '@/types/onboarding';

// Role options data
const roleOptions: RoleOption[] = [
  {
    id: 'personal',
    title: 'Personal Use',
    description: 'For individual professionals looking to enhance their career',
    icon: '👤',
    benefits: [
      'Personal branding tools',
      'LinkedIn optimization',
      'Career growth insights',
      'Individual analytics'
    ],
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    id: 'hr',
    title: 'HR Professional',
    description: 'For HR teams and recruiters managing talent acquisition',
    icon: '👥',
    benefits: [
      'Team management tools',
      'Candidate tracking system',
      'Recruitment automation',
      'Team analytics & reports'
    ],
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  }
];

// Plan options data
const planOptions: PlanOption[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      'Basic profile management',
      'Limited job postings',
      'Basic analytics',
      'Email support'
    ],
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    period: 'month',
    description: 'Great for growing teams',
    features: [
      'Everything in Free',
      'Unlimited job postings',
      'Advanced analytics',
      'Priority support',
      'Team collaboration tools',
      'Custom branding'
    ],
    trialDays: 14,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    period: 'month',
    description: 'For enterprise teams',
    features: [
      'Everything in Basic',
      'Advanced AI features',
      'Custom integrations',
      'Dedicated support',
      'Advanced reporting',
      'API access',
      'White-label options'
    ],
    isPopular: true,
    trialDays: 14,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  }
];

const OnboardingModal: React.FC = () => {
  const {
    isOpen,
    currentStep,
    selectedRole,
    selectedPlan,
    isLoading,
    closeOnboarding,
    setSelectedRole,
    setSelectedPlan,
    nextStep,
    previousStep,
    completeOnboarding
  } = useOnboarding();

  const handleComplete = async () => {
    if (!selectedRole || !selectedPlan) return;

    const onboardingData = {
      role: selectedRole,
      plan: selectedPlan,
      trialStartDate: selectedPlan !== 'free' ? new Date() : undefined,
      onboardingCompleted: true
    };

    await completeOnboarding(onboardingData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'role':
        return selectedRole !== null;
      case 'plan':
        return selectedPlan !== null;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'role':
        return 'Choose Your Role';
      case 'plan':
        return 'Select Your Plan';
      case 'confirmation':
        return 'You\'re All Set!';
      default:
        return 'Welcome to Klarus HR';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'role':
        return 'Tell us how you\'ll be using Klarus HR to personalize your experience';
      case 'plan':
        return 'Choose the plan that best fits your needs. Start with a 14-day free trial!';
      case 'confirmation':
        return 'Review your selections and complete your setup';
      default:
        return 'Let\'s get you started with Klarus HR';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'role':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleOptions.map((role) => (
              <RoleSelectionCard
                key={role.id}
                role={role}
                isSelected={selectedRole === role.id}
                onSelect={() => setSelectedRole(role.id)}
              />
            ))}
          </div>
        );

      case 'plan':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planOptions.map((plan) => (
              <PlanSelectionCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            ))}
          </div>
        );

      case 'confirmation':
        const selectedRoleData = roleOptions.find(r => r.id === selectedRole);
        const selectedPlanData = planOptions.find(p => p.id === selectedPlan);
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Perfect! Here's what you've selected:
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Your Role</h4>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{selectedRoleData?.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedRoleData?.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedRoleData?.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Your Plan</h4>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedPlanData?.name} Plan
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    ${selectedPlanData?.price}/{selectedPlanData?.period}
                  </div>
                  {selectedPlanData?.trialDays && (
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      🎉 {selectedPlanData.trialDays}-day free trial included
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Your account will be set up with your selected preferences</li>
                <li>• You'll get full access to all features</li>
                <li>• We'll guide you through your first steps</li>
                {selectedPlanData?.trialDays && (
                  <li>• Your {selectedPlanData.trialDays}-day free trial starts now</li>
                )}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeOnboarding}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {['role', 'plan', 'confirmation'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === step
                    ? "bg-blue-500 text-white"
                    : ['role', 'plan', 'confirmation'].indexOf(currentStep) > index
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                )}
              >
                {['role', 'plan', 'confirmation'].indexOf(currentStep) > index ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2",
                    ['role', 'plan', 'confirmation'].indexOf(currentStep) > index
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="py-4">
          {renderStepContent()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 'role' || isLoading}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-3">
            {currentStep === 'confirmation' ? (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed() || isLoading}
                className="flex items-center"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
