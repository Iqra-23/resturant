// src/components/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useStripe as useStripeContext } from '../contexts/StripeContext';

// Payment form component that handles the actual payment
const CheckoutForm = ({ 
  amount, 
  onSuccess, 
  onError, 
  metadata = {},
  buttonText = "Pay Now",
  isProcessing: externalProcessing = false 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      console.error('Payment error:', error);
      setMessage(error.message);
      onError?.(error);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded:', paymentIntent);
      setMessage('Payment succeeded!');
      onSuccess?.(paymentIntent);
    }

    setIsProcessing(false);
  };

  const processing = isProcessing || externalProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>
      
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('succeeded') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
          processing || !stripe
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          `${buttonText} Rs ${amount}`
        )}
      </button>
    </form>
  );
};

// Main payment form wrapper - FIXED: Create new Elements instance each time
const PaymentForm = ({ 
  amount, 
  onSuccess, 
  onError, 
  metadata = {},
  currency = 'pkr',
  buttonText = "Pay Now",
  appearance = {}
}) => {
  const { stripePromise, createPaymentIntent, loading, error } = useStripeContext();
  const [clientSecret, setClientSecret] = useState('');
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [elementsKey, setElementsKey] = useState(0); // Key to force re-render

  useEffect(() => {
    if (amount && !clientSecret) {
      createIntent();
    }
  }, [amount]);

  const createIntent = async () => {
    setIsCreatingIntent(true);
    try {
      console.log('🔄 Creating payment intent for amount:', amount);
      const { clientSecret } = await createPaymentIntent(amount, currency, metadata);
      console.log('✅ Got client secret:', clientSecret);
      setClientSecret(clientSecret);
      setElementsKey(prev => prev + 1); // Force new Elements instance
    } catch (err) {
      console.error('❌ Error creating payment intent:', err);
      onError?.(err);
    } finally {
      setIsCreatingIntent(false);
    }
  };

  if (loading || error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading Stripe...</p>
            </div>
          ) : (
            <div className="text-red-600">
              <p className="font-semibold">Error loading payment system</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!clientSecret || isCreatingIntent) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mb-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">
            {isCreatingIntent ? 'Preparing payment...' : 'Initializing...'}
          </p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      ...appearance,
    },
  };

  return (
    <div className="bg-white">
      {/* FIXED: Use key prop to create new Elements instance when clientSecret changes */}
      <Elements key={elementsKey} stripe={stripePromise} options={options}>
        <CheckoutForm 
          amount={amount}
          onSuccess={onSuccess}
          onError={onError}
          metadata={metadata}
          buttonText={buttonText}
          isProcessing={isCreatingIntent}
        />
      </Elements>
    </div>
  );
};

export default PaymentForm;