
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/UI/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, CheckCircle, AlertCircle, Calendar, DollarSign } from 'lucide-react';

interface SubscriptionData {
  subscribed: boolean;
  subscription: {
    id: string;
    status: string;
    current_period_end: number;
    amount: number;
    currency: string;
  } | null;
}

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isCreatingPortal, setIsCreatingPortal] = useState(false);

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription-status');
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSubscriptionData(data);
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      toast.error('Failed to check subscription status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
    
    // Check for success/cancel URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast.success('Subscription activated successfully!');
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh subscription status
      setTimeout(checkSubscriptionStatus, 2000);
    } else if (urlParams.get('canceled') === 'true') {
      toast.error('Subscription setup was canceled');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    setIsCreatingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout');
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast.error('Please log in to manage subscription');
      return;
    }

    setIsCreatingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-customer-portal');
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.url) {
        // Open customer portal in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating portal session:', error);
      toast.error('Failed to open customer portal');
    } finally {
      setIsCreatingPortal(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Billing & Subscription
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your Klarus HR subscription and billing information.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Current Plan
            </h3>
            <Button 
              onClick={checkSubscriptionStatus}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
          </div>
          
          {subscriptionData?.subscribed ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Active Subscription
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatAmount(
                      subscriptionData.subscription?.amount || 1999,
                      subscriptionData.subscription?.currency || 'usd'
                    )} per month
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Next billing: {formatDate(subscriptionData.subscription?.current_period_end || 0)}
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleManageSubscription}
                disabled={isCreatingPortal}
                className="w-full"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isCreatingPortal ? 'Opening...' : 'Manage Subscription'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  No Active Subscription
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Subscribe to Klarus HR to access all premium features.
              </p>
              
              <Button 
                onClick={handleSubscribe}
                disabled={isCreatingCheckout}
                className="w-full"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isCreatingCheckout ? 'Creating...' : 'Subscribe for $19.99/month'}
              </Button>
            </div>
          )}
        </div>

        {/* Plan Features Card */}
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Klarus HR Features
          </h3>
          
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Unlimited job postings</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Candidate management system</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>LinkedIn integration</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Advanced analytics</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Priority support</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Custom themes and branding</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
