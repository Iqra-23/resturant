import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import PaymentForm from '../components/PaymentForm';

// Receive addToCart and cart from props
function MenuDetail({ addToCart, cart, currentUser }) { 
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const params = new URLSearchParams(location.search);
      const productId = params.get('productId');

      console.log("🔍 productId from URL:", productId);

      if (!productId) {
        console.warn("⚠️ No productId in URL");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/products/${productId}`);
        const data = await res.json();

        console.log("✅ API Response:", data);

        if (!res.ok || !data || !data._id) {
          throw new Error(data.error || "Invalid product response");
        }

        setProduct(data);
      } catch (error) {
        console.error("❌ Fetch Error:", error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [location.search]);

  const handleGoBack = () => navigate(-1);

  // Show payment form when user clicks "Place Order"
  const handleShowPayment = () => {
    if (!currentUser) {
      alert("Please log in to place an order.");
      navigate("/login");
      return;
    }
    setShowPayment(true);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      alert(`${product.name} added to cart!`);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntent) => {
    console.log("🎉 Payment successful:", paymentIntent);
    
    setOrderLoading(true);
    
    try {
      // Ensure currentUser is available before proceeding
      if (!currentUser || !currentUser._id) {
        throw new Error("User not logged in or user ID not found.");
      }

      // Now place the order after successful payment
      const orderData = {
        userId: currentUser._id, // Get this from authentication
        restaurantId: product.restaurantId || "675a123456789012345678cd", // Fallback if product.restaurantId is missing
        products: cart.map(item => ({ // Use the entire cart for the order
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), // Calculate total from cart
        notes: `Order from cart`,
        paymentIntentId: paymentIntent.id, // Link payment to order
        paymentStatus: 'completed'
      };

      console.log("📦 Placing order after payment:", orderData);

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log("📊 Order response:", result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to place order');
      }

      console.log("✅ Order placed successfully:", result);
      
      const orderId = result.data?._id || result._id || 'N/A';
      alert(`🎉 Payment successful! Order placed successfully! Order ID: ${orderId}`);
      
      // Clear cart after successful order
      // clearCart(); // You'll need to pass clearCart if you want to clear it here

      // Navigate to success page or back to menu
      navigate('/order-success', { 
        state: { 
          orderId, 
          paymentIntentId: paymentIntent.id,
          // Only pass the product if it's a single item order, otherwise consider passing cart summary
          product: product // Keeping this for now if you want to show details of the initially viewed product
        } 
      });
      
    } catch (error) {
      console.error("❌ Order placement error after payment:", error.message);
      alert(`Payment successful but order placement failed: ${error.message}. Please contact support with Payment ID: ${paymentIntent.id}`);
    } finally {
      setOrderLoading(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error) => {
    console.error("❌ Payment failed:", error);
    alert(`Payment failed: ${error.message}`);
    setShowPayment(false); // Hide payment form to allow retry
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar cart={cart} currentUser={currentUser} /> {/* Pass cart and currentUser to Navbar */}
        <main className="flex-1 bg-black p-8 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar cart={cart} currentUser={currentUser} /> {/* Pass cart and currentUser to Navbar */}
        <main className="flex-1 bg-black p-8 flex items-center justify-center">
          <div className="text-white text-xl">Product not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate if the current product is already in the cart to adjust button text
  const itemInCart = cart.find(item => (item.id || item._id) === (product.id || product._id));
  const buttonText = itemInCart ? `Add One More (Current: ${itemInCart.quantity})` : 'Add to Cart';


  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar cart={cart} currentUser={currentUser} /> {/* Pass cart and currentUser to Navbar */}
      <main className="flex-1 bg-black p-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={handleGoBack} className="mb-4 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
            ← Back to Menu
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-64 md:h-80">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-4">
              <div className="mb-3">
                <h1 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h1>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-green-600">Rs {product.price}</span>
                  <span className="text-yellow-500 text-sm">{product.rating} ⭐</span>
                </div>
                <p className="text-gray-600 text-xs mb-1">
                  <span className="font-semibold">Location:</span> {product.location}
                </p>
                <p className="text-gray-600 text-xs mb-2">
                  <span className="font-semibold">Category:</span> {product.category} | <span className="font-semibold">Prep Time:</span> {product.preparationTime}
                </p>
              </div>

              <p className="text-gray-700 mb-3 text-sm">{product.description}</p>

              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-xs">Ingredients:</h3>
                  <div className="flex flex-wrap gap-1">
                    {(product.ingredients || []).map((ingredient, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-xs">Nutrition:</h3>
                  <p className="text-gray-600 text-xs">{product.nutritionInfo || 'Not available'}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-xs">Allergens:</h3>
                  <div className="flex flex-wrap gap-1">
                    {(product.allergens || []).map((allergen, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart or Proceed to Payment */}
              {showPayment ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
                  <PaymentForm
                    amount={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} // Pay for the whole cart
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    metadata={{
                      userId: currentUser?._id, // Pass current user ID
                      cartItems: cart.map(item => ({ id: item._id || item.id, name: item.name, quantity: item.quantity }))
                    }}
                    currency="pkr"
                    buttonText="Pay Now for Cart"
                  />
                  <button 
                    onClick={() => setShowPayment(false)}
                    className="mt-2 w-full py-2 px-4 rounded-lg font-semibold text-sm bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Cancel Payment
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {buttonText}
                  </button>
                  <button 
                    onClick={handleShowPayment} 
                    disabled={orderLoading || cart.length === 0} // Disable if cart is empty
                    className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${
                      orderLoading || cart.length === 0
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {orderLoading ? 'Processing...' : `Place Order (Cart Total: Rs ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MenuDetail;