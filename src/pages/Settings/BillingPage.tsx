import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase'; // Assuming you have supabase client configured
import { toast } from 'sonner';
import { Button } from '@/components/UI/button'; // Assuming you have a Button component

// Using the provided Stripe publishable key
const stripePromise = loadStripe('pk_live_51RTC6JCfskS4ePH3XH16jF1kMMAE9YWAhyBOWZTi2uO60kdwfeZXP9mDvrYoYiTY8RueUpQNmBjKZDKm1IvZmVsu00U6yJZyBb');

const FIXED_AMOUNT = 1999; // $19.99 in cents
const CURRENCY = 'usd';

// New CheckoutForm component
const CheckoutForm: React.FC<{ clientSecret: string }> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe.js has not yet loaded.');
      return;
    }

    setIsLoading(true);
    setPaymentStatusMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/settings/billing?payment_success=true`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setPaymentStatusMessage(error.message || 'An unexpected error occurred. Please check your card details.');
      } else {
        setPaymentStatusMessage("An unexpected error occurred while attempting to process your payment.");
      }
    } else {
      setPaymentStatusMessage("Processing payment... you should be redirected shortly.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      <Button type="submit" disabled={isLoading || !stripe || !elements} className="w-full">
        {isLoading ? 'Processing...' : `Pay $${(FIXED_AMOUNT / 100).toFixed(2)}`}
      </Button>
      {paymentStatusMessage && 
        <div className={`mt-2 text-sm ${paymentStatusMessage.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {paymentStatusMessage}
        </div>
      }
    </form>
  );
};

const BillingPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingClientSecret, setIsLoadingClientSecret] = useState(true);
  const [paymentAttempted, setPaymentAttempted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for payment success query params on component mount (from redirect)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
      setPaymentSuccess(true);
      toast.success('Payment processed successfully!');
      // Clean the URL
      window.history.replaceState({}, document.title, `${window.location.pathname}`);
    } else if (urlParams.get('payment_error')) {
      setPaymentSuccess(false);
      toast.error(urlParams.get('payment_error') || 'Payment failed. Please try again.');
      window.history.replaceState({}, document.title, `${window.location.pathname}`);
    }
  }, []);

  useEffect(() => {
    // Fetch client secret for the Payment Intent when the page loads
    const fetchPaymentIntent = async () => {
      if (paymentAttempted || clientSecret) return; // Don't refetch if already attempted or have secret

      setIsLoadingClientSecret(true);
      try {
        const { data, error } = await supabase.functions.invoke('stripe-payment-intent', {
          body: { amount: FIXED_AMOUNT, currency: CURRENCY, description: 'Klarus HR One-Time Payment' },
        });

        if (error) {
          throw new Error(error.message);
        }
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('Failed to get payment client secret.');
        }
      } catch (err: any) {
        console.error('Error fetching payment intent:', err);
        toast.error(`Error initializing payment: ${err.message}`);
      }
      setIsLoadingClientSecret(false);
    };

    fetchPaymentIntent();
  }, [paymentAttempted, clientSecret]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de', // Your brand color
    },
  };

  const options = clientSecret ? {
    clientSecret,
    appearance,
  } : {};

  if (paymentSuccess) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 dark:text-gray-300">Your payment of $${(FIXED_AMOUNT / 100).toFixed(2)} has been processed.</p>
        {/* Add a button to navigate elsewhere or refresh data */}
      </div>
    );
  }
  
  if (paymentSuccess === false) {
     return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-700 dark:text-gray-300">There was an issue with your payment. Please try again or contact support.</p>
        <Button onClick={() => { setPaymentSuccess(null); setClientSecret(null); /* Allow refetch */ }} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options as any}> {/* Cast options because type might not be perfect yet */}
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Complete Your Payment
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Securely pay $${(FIXED_AMOUNT / 100).toFixed(2)} USD with Stripe.
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 max-w-md mx-auto">
          {isLoadingClientSecret && <p className="text-center text-gray-600 dark:text-gray-300">Loading payment form...</p>}
          {!isLoadingClientSecret && clientSecret && (
            <CheckoutForm clientSecret={clientSecret} />
          )}
          {!isLoadingClientSecret && !clientSecret && (
            <p className="text-center text-red-600 dark:text-red-400">Could not initialize payment form. Please try again later.</p>
          )}
        </div>
      </div>
    </Elements>
  );
};

export default BillingPage; 