// src/pages/PaymentPage.jsx (Enhanced)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const PaymentPage = ({ 
  cart, 
  cartTotal, 
  cartItemCount,
  clearCart, 
  currentUser,
  removeFromCart,
  updateCartQuantity 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Check if cart is empty and redirect
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/');
      return;
    }
  }, [cart, navigate]);

  const handlePaymentSuccess = async (paymentIntent) => {
    setIsProcessingOrder(true);
    
    try {
      // Create order after successful payment
      const orderData = {
        userId: currentUser?._id || "675a123456789012345678ab",
        restaurantId: cart[0]?.restaurantId || "675a123456789012345678cd",
        products: cart.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: cartTotal,
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'completed',
        notes: `Order with payment ID: ${paymentIntent.id}`
      };

      console.log("📦 Creating order after payment:", orderData);

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("❌ Failed to parse order response:", parseError);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      if (!response.ok) {
        const errorMessage = result.message || result.error || result.details || 'Failed to create order';
        console.error("❌ Order creation error:", result);
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }

      console.log("✅ Order created successfully:", result);

      // Clear cart after successful order
      clearCart();

      // Navigate to success page with order details
      navigate('/order-success', {
        state: {
          orderId: result.data?._id || result._id,
          total: cartTotal,
          paymentIntentId: paymentIntent.id,
          items: cart
        }
      });

    } catch (error) {
      console.error("❌ Error creating order:", error);
      alert(`Payment successful but order creation failed: ${error.message}`);
      
      // Still navigate to success page but with limited info
      navigate('/order-success', {
        state: {
          orderId: paymentIntent.id,
          total: cartTotal,
          paymentIntentId: paymentIntent.id,
          items: cart
        }
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error.message}`);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar 
          currentUser={currentUser}
          cart={cart}
          removeFromCart={removeFromCart}
          updateCartQuantity={updateCartQuantity}
          clearCart={clearCart}
          cartTotal={cartTotal}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2m5 8v6a2 2 0 002 2h6a2 2 0 002-2v-6m-4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to proceed with checkout.</p>
            <button 
              onClick={() => navigate('/restaurant')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Browse Menu
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        currentUser={currentUser}
        cart={cart}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        clearCart={clearCart}
        cartTotal={cartTotal}
      />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/restaurant')}
              className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Menu
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {cartItemCount} items
                </span>
              </div>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id || item._id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                    {/* Item Image */}
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600">Rs {item.price} each</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateCartQuantity(item.id || item._id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-3 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id || item._id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id || item._id)}
                          className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span>Rs {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee:</span>
                  <span>Rs 0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span>Rs {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Customer Info */}
              {currentUser && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Information</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Customer:</strong> {currentUser.name || 'Guest'}
                  </p>
                  {currentUser.email && (
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {currentUser.email}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
              
              {isProcessingOrder && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-800 font-medium">Processing your order...</span>
                  </div>
                </div>
              )}

              <PaymentForm
                amount={cartTotal}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                metadata={{
                  orderId: `order-${Date.now()}`,
                  customerId: currentUser?._id || 'guest',
                  itemCount: cartItemCount,
                  items: cart.map(item => `${item.name} x${item.quantity}`).join(', ')
                }}
                buttonText={`Pay Rs ${cartTotal.toFixed(2)}`}
                currency="pkr"
              />

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Secure Payment
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your payment information is encrypted and secure. We accept all major credit cards.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Powered by</span>
                    <span className="text-xs font-semibold text-blue-600">Stripe</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                    <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                    <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  placeholder="Any special requests for your order..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>
            </div>

          </div>

          {/* Security Info */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Order is Protected</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    SSL encrypted payment processing
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Order tracking and updates via SMS
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    100% satisfaction guarantee
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPage;