// src/pages/RestaurantMenu.jsx (Updated)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

function RestaurantDetail({ addToCart, cart, currentUser, removeFromCart, updateCartQuantity, clearCart }) {
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState(null); // Track which item is being added
  const navigate = useNavigate();

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurants and products in parallel
      const [restaurantsRes, productsRes] = await Promise.all([
        fetch('http://localhost:3000/api/restaurants'),
        fetch('http://localhost:3000/api/products')
      ]);

      if (!restaurantsRes.ok || !productsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const restaurantsData = await restaurantsRes.json();
      const productsData = await productsRes.json();

      setRestaurants(restaurantsData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!currentUser) {
      alert('Please log in to add items to cart');
      navigate('/login');
      return;
    }

    setAddingToCart(product._id);
    
    // Add a small delay for better UX
    setTimeout(() => {
      const cartItem = {
        id: product._id,
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        restaurantId: product.restaurantId,
        category: product.category,
        description: product.description
      };

      addToCart(cartItem);
      setAddingToCart(null);
    }, 300);
  };

  const handleViewDetails = (productId) => {
    navigate(`/menudetail?productId=${productId}`);
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious food...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
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
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️ Error loading data</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Try Again
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Menu</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover delicious dishes from our partner restaurants. Add items to your cart and enjoy convenient delivery.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <span>
                Showing {filteredProducts.length} of {products.length} dishes
              </span>
              {cart.length > 0 && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {cart.reduce((total, item) => total + item.quantity, 0)} items in cart
                </span>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No dishes found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'No dishes available in this category'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const isInCart = cart.find(item => (item.id || item._id) === product._id);
                const isAdding = addingToCart === product._id;
                
                return (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={product.image || '/api/placeholder/300/200'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isInCart && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          In Cart ({isInCart.quantity})
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Category and Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                        {product.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">⭐</span>
                            <span className="text-sm font-medium">{product.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          Rs {product.price}
                        </span>
                        {product.preparationTime && (
                          <span className="text-sm text-gray-500 ml-2">
                            • {product.preparationTime}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isAdding}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                            isAdding
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : isInCart
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                          }`}
                        >
                          {isAdding ? (
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Adding...
                            </div>
                          ) : isInCart ? (
                            '✓ Added to Cart'
                          ) : (
                            'Add to Cart'
                          )}
                        </button>

                        <button
                          onClick={() => handleViewDetails(product._id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cart Summary Footer (Sticky) */}
          {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {cart.reduce((total, item) => total + item.quantity, 0)} items
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    Rs {cartTotal.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => navigate('/payment')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default RestaurantDetail;