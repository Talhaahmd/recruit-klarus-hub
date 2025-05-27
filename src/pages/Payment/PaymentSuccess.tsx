
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess: React.FC = () => {
  const { user } = useAuth();

  // Check subscription status on success page load
  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        try {
          await supabase.functions.invoke('check-subscription', {
            headers: {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
          });
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
    };

    checkSubscription();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-8">
      {/* Logo */}
      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center">
          <img 
            className="w-auto h-9" 
            src="/lovable-uploads/67d45eae-154d-4a02-a7a5-1f115188b97b.png" 
            alt="Klarus HR Logo" 
          />
        </Link>
      </div>

      <div className="max-w-md w-full">
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-400">
                Welcome to Klarus HR Premium! Your subscription is now active.
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-400 mb-2">Premium Features Unlocked:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✓ Unlimited CV access and storing</li>
                <li>✓ Unlimited active jobs</li>
                <li>✓ Up to 8 LinkedIn Posts per month</li>
                <li>✓ Up to 8 LinkedIn job posts per month</li>
              </ul>
            </div>

            <Button 
              asChild
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg"
            >
              <Link to="/dashboard">
                Go to Dashboard
              </Link>
            </Button>

            <p className="text-sm text-gray-400 mt-4">
              Questions? Contact our support team anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
