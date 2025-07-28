import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import CartIcon from './CartIcon';
import Cart from './Cart';

function Navbar({ 
  cart = [], 
  removeFromCart, 
  updateCartQuantity, 
  clearCart, 
  cartTotal = 0, 
  currentUser 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const handleRestaurantSelect = (restaurant) => {
    console.log(`Selected restaurant: ${restaurant}`);
    navigate(`/restaurant?selected=${restaurant.toLowerCase()}`);
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  const buttonStyles = "text-red-600 hover:text-red-700 py-2 px-6 rounded-md text-base font-semibold transition-all duration-200 min-w-[140px] text-center";

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          className="text-white bg-gray-900 p-4 absolute top-4 right-4 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-white w-64 h-full p-6 flex flex-col">
              {/* Logo and Close */}
              <div className="flex justify-between items-center mb-8">
                <img className="h-16 w-auto" src={logo} alt="Logo" />
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-700 text-2xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex flex-col gap-4">
                <button onClick={() => { navigate('/'); setIsSidebarOpen(false); }} className={buttonStyles}>
                  Home
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`${buttonStyles} w-full text-left flex items-center justify-between`}
                  >
                    Restaurants
                    <svg
                      className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 bg-white rounded-md shadow-lg w-full z-50">
                      {['KFC', 'Cheezious', 'Ranchers'].map((res) => (
                        <button
                          key={res}
                          onClick={() => handleRestaurantSelect(res)}
                          className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => { navigate('/contact-us'); setIsSidebarOpen(false); }} className={buttonStyles}>
                  Contact Us
                </button>
              </div>

              {/* Sidebar Footer Buttons */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  onClick={() => { navigate('/login'); setIsSidebarOpen(false); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm"
                >
                  Login
                </button>

                {/* Cart Icon in Sidebar */}
                <CartIcon 
                  cart={cart} 
                  onClick={() => { 
                    toggleCart(); 
                    setIsSidebarOpen(false); // Close sidebar when cart is opened
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-white shadow-md font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/">
                <img className="h-16 w-auto" src={logo} alt="Logo" />
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-gray-900 text-base font-semibold">Home</a>

              {/* Restaurants Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-700 hover:text-gray-900 text-base font-semibold flex items-center"
                >
                  Restaurants
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-3 bg-white rounded-md shadow-lg py-1 w-48 z-10">
                    {['KFC', 'Cheezious', 'Ranchers'].map((res) => (
                      <button
                        key={res}
                        onClick={() => handleRestaurantSelect(res)}
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <a href="/contact-us" className="text-gray-700 hover:text-gray-900 text-base font-semibold">Contact Us</a>
            </div>

            {/* Desktop Auth and Cart */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <span className="text-gray-700 text-base font-semibold">
                  Hi, {currentUser.name || currentUser.email}!
                </span>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                >
                  Login
                </button>
              )}
              <CartIcon cart={cart} onClick={toggleCart} />
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar Component */}
      <Cart
        cart={cart}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        clearCart={clearCart}
        cartTotal={cartTotal}
        currentUser={currentUser}
        isOpen={isCartOpen}
        onClose={closeCart}
      />
    </>
  );
}

export default Navbar;