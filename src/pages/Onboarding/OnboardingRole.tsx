import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profilesService } from '@/services/profilesService';
import { toast } from 'sonner';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';

const OnboardingRole: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = async (role: 'personal' | 'hr') => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const updated = await profilesService.updateProfile({ role });
      if (!updated) throw new Error('Failed to save role');
      toast.success('Role saved');
      navigate('/onboarding/plan', { replace: true });
    } catch (e: any) {
      toast.error(e.message || 'Failed to save role');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 dark:border-gray-800 hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle>Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">I'm here for personal branding or a job search.</p>
            <Button disabled={submitting} onClick={() => handleSelect('personal')} className="w-full">Choose Personal</Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle>HR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">I'm hiring or managing candidates.</p>
            <Button disabled={submitting} onClick={() => handleSelect('hr')} className="w-full">Choose HR</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingRole;
