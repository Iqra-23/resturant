// src/services/stripeService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class StripeService {
  // Get Stripe publishable key
  static async getPublishableKey() {
    try {
      // First try to get from environment variable (for development)
      const envKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (envKey) {
        console.log('Using publishable key from environment');
        return envKey;
      }

      // Fallback to API call
      const response = await fetch(`${API_BASE_URL}/stripe/config`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Publishable key response:', data);
      
      if (!data.publishableKey) {
        throw new Error('No publishable key in response');
      }
      
      return data.publishableKey;
    } catch (error) {
      console.error('Error fetching publishable key:', error);
      throw error;
    }
  }

  // Create payment intent
  static async createPaymentIntent(amount, currency = 'pkr', metadata = {}) {
    try {
      console.log('Creating payment intent:', { amount, currency, metadata });
      
      const response = await fetch(`${API_BASE_URL}/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment intent error:', errorData);
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const result = await response.json();
      console.log('Payment intent created:', result);
      return result;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Create customer
  static async createCustomer(email, name, metadata = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/stripe/create-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Create subscription
  static async createSubscription(customerId, priceId, metadata = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/stripe/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          priceId,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Get payment status
  static async getPaymentStatus(paymentIntentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/stripe/payment-status/${paymentIntentId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get payment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/stripe/cancel-subscription/${subscriptionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }
}

export default StripeService;