import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import PaymentForm from '../components/PaymentForm';

function MenuDetail({ 
  addToCart, 
  cart, 
  clearCart, 
  currentUser,
  removeFromCart,
  updateCartQuantity,
  cartTotal,
  cartItemCount,
  setCurrentUser,
  setIsLoggedIn,
  isLoggedIn
}) { 
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const params = new URLSearchParams(location.search);
      const productId = params.get('productId');

      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/products/${productId}`);
        const data = await res.json();

        if (!res.ok || !data || !data._id) {
          throw new Error(data.error || "Invalid product response");
        }

        setProduct(data);
        
        if (data.restaurantId) {
          try {
            const restaurantRes = await fetch(`http://localhost:3000/api/restaurants/${data.restaurantId}`);
            if (restaurantRes.ok) {
              const restaurantData = await restaurantRes.json();
              setRestaurant(restaurantData);
            }
          } catch (err) {
            console.warn("⚠️ Could not fetch restaurant data:", err);
          }
        }
        
      } catch (error) {
        console.error("❌ Fetch Error:", error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [location.search]);

  // ✅ MODIFIED: This function now goes to the correct restaurant route
  const handleGoBack = () => {
    const restaurantId =
      restaurant?._id ||
      restaurant?.id ||
      product?.restaurantId ||
      cart?.[0]?.restaurantId;

    if (restaurantId) {
      navigate(`/restaurant?selected=${restaurantId}`);
    } else {
      navigate('/');
    }
  };

  const getBackButtonText = () => {
    if (restaurant || product?.restaurantId) {
      return 'Back to Restaurant Menu';
    }
    return 'Back to Home';
  };

  const handleShowPayment = () => {
    if (!currentUser) {
      alert("Please log in to place an order.");
      navigate("/login");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your cart is empty. Please add items to your cart first.");
      return;
    }

    const total = cartTotal || cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);

    if (total <= 0) {
      alert("Invalid cart total. Please check your items.");
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

  const handlePaymentSuccess = async (paymentIntent) => {
    setOrderLoading(true);

    try {
      if (!currentUser || !currentUser._id) throw new Error("User not logged in or user ID not found.");
      if (!cart || cart.length === 0) throw new Error("Cart is empty. Cannot place order.");

      const totalAmount = cartTotal || cart.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return sum + (price * quantity);
      }, 0);

      if (totalAmount <= 0) throw new Error("Invalid cart total amount.");

      const restaurantId = product?.restaurantId || restaurant?._id || cart[0]?.restaurantId;

      const orderData = {
        userId: currentUser._id,
        restaurantId,
        products: cart.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1
        })),
        totalAmount,
        notes: `Order from cart - ${cart.length} item(s)`,
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'completed'
      };

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to place order');

      alert(`🎉 Payment successful! Order placed. Order ID: ${result.data?._id || result._id || 'N/A'}`);

      if (clearCart) clearCart();

      navigate('/order-success', { 
        state: { 
          orderId: result._id, 
          paymentIntentId: paymentIntent.id,
          totalAmount,
          restaurant
        } 
      });
      
    } catch (error) {
      alert(`Payment successful but order placement failed: ${error.message}.`);
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    alert(`Payment failed: ${error.message || 'Unknown error'}`);
    setShowPayment(false);
  };

  const getCartTotal = () => {
    if (cartTotal !== undefined) return cartTotal;
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);
  };

  const calculatedCartTotal = getCartTotal();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar {...{ cartItemCount, currentUser, setCurrentUser, setIsLoggedIn, isLoggedIn, cart, removeFromCart, updateCartQuantity, cartTotal }} />
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
        <Navbar {...{ cartItemCount, currentUser, setCurrentUser, setIsLoggedIn, isLoggedIn, cart, removeFromCart, updateCartQuantity, cartTotal }} />
        <main className="flex-1 bg-black p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xl mb-4">Product not found</div>
            <button onClick={handleGoBack} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {getBackButtonText()}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const itemInCart = cart.find(item => (item.id || item._id) === (product.id || product._id));
  const buttonText = itemInCart ? `Add One More (Current: ${itemInCart.quantity})` : 'Add to Cart';

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar {...{ cartItemCount, currentUser, setCurrentUser, setIsLoggedIn, isLoggedIn, cart, removeFromCart, updateCartQuantity, cartTotal }} />
      <main className="flex-1 bg-black p-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={handleGoBack} className="mb-4 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
            ← {getBackButtonText()}
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
                {restaurant && (
                  <p className="text-gray-600 text-xs mb-2">
                    <span className="font-semibold">Restaurant:</span> {restaurant.name}
                  </p>
                )}
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

              {showPayment ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
                  <PaymentForm
                    amount={calculatedCartTotal}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    metadata={{
                      userId: currentUser?._id,
                      restaurantId: product?.restaurantId || restaurant?._id || 'unknown',
                      cartItems: cart.map(item => ({ 
                        id: item._id || item.id, 
                        name: item.name, 
                        quantity: item.quantity,
                        price: item.price 
                      }))
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
                    disabled={orderLoading || calculatedCartTotal <= 0}
                    className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${
                      orderLoading || calculatedCartTotal <= 0
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {orderLoading ? 'Processing...' : `Place Order (Cart Total: Rs ${calculatedCartTotal.toFixed(2)})`}
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
