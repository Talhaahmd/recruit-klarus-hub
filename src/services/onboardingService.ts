import { supabase } from '@/lib/supabase';
import type { OnboardingData, UserRole, PlanType } from '@/types/onboarding';

export interface OnboardingService {
  getOnboardingStatus: (userId: string) => Promise<OnboardingData | null>;
  updateOnboardingData: (userId: string, data: Partial<OnboardingData>) => Promise<OnboardingData>;
  completeOnboarding: (userId: string, data: OnboardingData) => Promise<OnboardingData>;
  startTrial: (userId: string, planType: PlanType) => Promise<Date>;
  checkTrialStatus: (userId: string) => Promise<{ isActive: boolean; daysRemaining: number; endDate: Date } | null>;
}

class OnboardingServiceImpl implements OnboardingService {
  private getStorageKey(userId: string): string {
    return `onboarding_${userId}`;
  }

  async getOnboardingStatus(userId: string): Promise<OnboardingData | null> {
    try {
      // For now, use localStorage to store onboarding data
      // This can be easily migrated to database later
      const storageKey = this.getStorageKey(userId);
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        const parsed = JSON.parse(storedData);
        return {
          role: parsed.role,
          plan: parsed.plan,
          trialStartDate: parsed.trialStartDate ? new Date(parsed.trialStartDate) : undefined,
          onboardingCompleted: parsed.onboardingCompleted || false
        };
      }

      return null;
    } catch (error) {
      console.error('Error in getOnboardingStatus:', error);
      return null;
    }
  }

  async updateOnboardingData(userId: string, data: Partial<OnboardingData>): Promise<OnboardingData> {
    try {
      const storageKey = this.getStorageKey(userId);
      const existingData = await this.getOnboardingStatus(userId);
      
      const updatedData = {
        ...existingData,
        ...data,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(storageKey, JSON.stringify(updatedData));

      return updatedData as OnboardingData;
    } catch (error) {
      console.error('Error in updateOnboardingData:', error);
      throw error;
    }
  }

  async completeOnboarding(userId: string, data: OnboardingData): Promise<OnboardingData> {
    try {
      const storageKey = this.getStorageKey(userId);
      const completedData = {
        ...data,
        onboardingCompleted: true,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(storageKey, JSON.stringify(completedData));

      return completedData;
    } catch (error) {
      console.error('Error in completeOnboarding:', error);
      throw error;
    }
  }

  async startTrial(userId: string, planType: PlanType): Promise<Date> {
    if (planType === 'free') {
      throw new Error('Free plan does not have a trial period');
    }

    const trialStartDate = new Date();
    
    try {
      const storageKey = this.getStorageKey(userId);
      const existingData = await this.getOnboardingStatus(userId);
      
      const updatedData = {
        ...existingData,
        plan: planType,
        trialStartDate: trialStartDate,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(storageKey, JSON.stringify(updatedData));

      return trialStartDate;
    } catch (error) {
      console.error('Error in startTrial:', error);
      throw error;
    }
  }

  async checkTrialStatus(userId: string): Promise<{ isActive: boolean; daysRemaining: number; endDate: Date } | null> {
    try {
      const onboardingData = await this.getOnboardingStatus(userId);
      
      if (!onboardingData || !onboardingData.trialStartDate || onboardingData.plan === 'free') {
        return null;
      }

      const trialStartDate = onboardingData.trialStartDate;
      const trialEndDate = new Date(trialStartDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days
      const now = new Date();
      
      const isActive = now < trialEndDate;
      const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

      return {
        isActive,
        daysRemaining,
        endDate: trialEndDate
      };
    } catch (error) {
      console.error('Error in checkTrialStatus:', error);
      return null;
    }
  }
}

export const onboardingService = new OnboardingServiceImpl();
