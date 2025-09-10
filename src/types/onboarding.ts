export type UserRole = 'personal' | 'hr';

export type PlanType = 'free' | 'basic' | 'premium';

export interface OnboardingData {
  role: UserRole;
  plan: PlanType;
  trialStartDate?: Date;
  onboardingCompleted: boolean;
}

export interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  color: string;
  bgColor: string;
}

export interface PlanOption {
  id: PlanType;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  trialDays?: number;
  color: string;
  bgColor: string;
}

export type OnboardingStep = 'role' | 'plan' | 'confirmation';

export interface OnboardingContextType {
  currentStep: OnboardingStep;
  selectedRole: UserRole | null;
  selectedPlan: PlanType | null;
  onboardingData: OnboardingData | null;
  isOpen: boolean;
  isLoading: boolean;
  setCurrentStep: (step: OnboardingStep) => void;
  setSelectedRole: (role: UserRole) => void;
  setSelectedPlan: (plan: PlanType) => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
}
