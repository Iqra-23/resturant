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

// Main payment form wrapper with minimum amount validation
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
  const [elementsKey, setElementsKey] = useState(0);
  const [validationError, setValidationError] = useState(null);

  // Client-side minimum amount validation
  const validateMinimumAmount = (amount, currency) => {
    const minimumAmounts = {
      'pkr': 185,  // PKR 185 ≈ $0.50 USD
      'usd': 0.50,
      'eur': 0.50,
      'gbp': 0.30,
      'inr': 42
    };

    const minimum = minimumAmounts[currency.toLowerCase()] || 0.50;
    
    if (amount < minimum) {
      return `Minimum payment amount is ${currency.toUpperCase()} ${minimum}. Please enter at least ${currency.toUpperCase()} ${minimum}.`;
    }
    
    return null;
  };

  useEffect(() => {
    if (amount) {
      // Validate minimum amount first
      const validation = validateMinimumAmount(amount, currency);
      if (validation) {
        setValidationError(validation);
        setClientSecret(''); // Clear any existing client secret
        return;
      }
      
      setValidationError(null);
      if (!clientSecret) {
        createIntent();
      }
    }
  }, [amount, currency]);

  const createIntent = async () => {
    setIsCreatingIntent(true);
    setValidationError(null);
    
    try {
      console.log('🔄 Creating payment intent for amount:', amount);
      const { clientSecret } = await createPaymentIntent(amount, currency, metadata);
      console.log('✅ Got client secret:', clientSecret);
      setClientSecret(clientSecret);
      setElementsKey(prev => prev + 1); // Force new Elements instance
    } catch (err) {
      console.error('❌ Error creating payment intent:', err);
      
      // Check if it's a minimum amount error
      if (err.message && err.message.includes('Minimum payment amount')) {
        setValidationError(err.message);
      } else {
        onError?.(err);
      }
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

  // Show validation error if amount is below minimum
  if (validationError) {
    return (
      <div className="bg-white p-6 rounded-lg border border-red-200">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Amount Too Low</h3>
          <p className="text-red-600 text-sm mb-4">{validationError}</p>
          <p className="text-gray-600 text-xs">
            This is due to Stripe's minimum payment requirements to cover processing fees.
          </p>
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