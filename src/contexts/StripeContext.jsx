// src/contexts/StripeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import StripeService from '../services/stripeService';

const StripeContext = createContext();

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        console.log('🔄 Initializing Stripe...');
        
        // Get publishable key from backend
        const publishableKey = await StripeService.getPublishableKey();
        console.log('🔑 Got publishable key:', publishableKey);
        
        // Initialize Stripe
        const stripe = loadStripe(publishableKey);
        setStripePromise(stripe);
        
        console.log('✅ Stripe initialized successfully');
      } catch (err) {
        console.error('❌ Failed to initialize Stripe:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  const createPaymentIntent = async (amount, currency = 'pkr', metadata = {}) => {
    try {
      console.log('💳 Creating payment intent...', { amount, currency, metadata });
      
      const result = await StripeService.createPaymentIntent(amount, currency, metadata);
      console.log('✅ Payment intent created:', result);
      
      return result;
    } catch (err) {
      console.error('❌ Failed to create payment intent:', err);
      throw err;
    }
  };

  const createCustomer = async (email, name, metadata = {}) => {
    try {
      console.log('👤 Creating customer...', { email, name });
      
      const result = await StripeService.createCustomer(email, name, metadata);
      console.log('✅ Customer created:', result);
      
      return result;
    } catch (err) {
      console.error('❌ Failed to create customer:', err);
      throw err;
    }
  };

  const getPaymentStatus = async (paymentIntentId) => {
    try {
      console.log('🔍 Getting payment status for:', paymentIntentId);
      
      const result = await StripeService.getPaymentStatus(paymentIntentId);
      console.log('✅ Payment status:', result);
      
      return result;
    } catch (err) {
      console.error('❌ Failed to get payment status:', err);
      throw err;
    }
  };

  const value = {
    stripePromise,
    loading,
    error,
    createPaymentIntent,
    createCustomer,
    getPaymentStatus,
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};

export default StripeContext;