import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profilesService } from '@/services/profilesService';
import { toast } from 'sonner';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const OnboardingPlan: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const choosePlan = async (plan: 'free' | 'basic' | 'premium') => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const now = new Date();
      const ends = addDays(now, 14);
      const updated = await profilesService.updateProfile({
        plan_tier: plan,
        trial_started_at: now.toISOString(),
        trial_ends_at: ends.toISOString(),
        onboarding_completed: true,
      } as any);
      if (!updated) throw new Error('Failed to save plan');

      toast.success('Trial started');

      if (plan === 'free') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/settings/billing', { replace: true });
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to save plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Pick your plan</h1>
          <p className="text-sm text-muted-foreground mt-2">14-day free trial is active</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Free</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Get started with core features.</p>
              <Button disabled={submitting} onClick={() => choosePlan('free')} className="w-full">Continue with Free</Button>
            </CardContent>
          </Card>

          <Card className="border border-primary/40">
            <CardHeader>
              <CardTitle>Basic</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Unlock additional tools for growth.</p>
              <Button disabled={submitting} onClick={() => choosePlan('basic')} className="w-full">Start Basic Trial</Button>
            </CardContent>
          </Card>

          <Card className="border border-yellow-500/40">
            <CardHeader>
              <CardTitle>Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Full power and advanced capabilities.</p>
              <Button disabled={submitting} onClick={() => choosePlan('premium')} className="w-full">Start Premium Trial</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPlan;
