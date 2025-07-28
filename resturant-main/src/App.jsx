import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RestaurantDetail from './pages/RestaurantMenu';
import MenuDetail from './pages/MenuDetail';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import ContactUs from './pages/ContactUs'; // Add if you have this page

// Import Stripe components
import { StripeProvider } from './contexts/StripeContext';

import OrderSuccess from './pages/OrderSuccess';
import PaymentPage from './pages/PaymentPage';

function App() {
  // User and authentication state
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Cart state for Stripe integration
  const [cart, setCart] = useState([]);

  // Load data from localStorage on app start
  useEffect(() => {
    // Load users
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Error loading users from localStorage:', error);
        setUsers([]);
      }
    }

    // Load cart
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart([]);
      }
    }

    // Load current user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error loading current user from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }, [currentUser]);

  // Cart management functions
  const addToCart = (item) => {
    if (!item || (!item.id && !item._id)) {
      console.error('Invalid item provided to addToCart:', item);
      return;
    }

    setCart(prevCart => {
      const itemId = item.id || item._id;
      const existingItem = prevCart.find(cartItem => 
        (cartItem.id || cartItem._id) === itemId
      );
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          (cartItem.id || cartItem._id) === itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { 
          ...item, 
          id: itemId, // Ensure consistent ID
          quantity: 1 
        }];
      }
    });

    // Show success feedback
    console.log(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId) => {
    if (!itemId) {
      console.error('Invalid itemId provided to removeFromCart:', itemId);
      return;
    }

    setCart(prevCart => prevCart.filter(item => 
      (item.id || item._id) !== itemId
    ));
    
    console.log(`Removed item ${itemId} from cart`);
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (!itemId) {
      console.error('Invalid itemId provided to updateCartQuantity:', itemId);
      return;
    }

    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        (item.id || item._id) === itemId 
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
    
    console.log(`Updated item ${itemId} quantity to ${quantity}`);
  };

  const clearCart = () => {
    setCart([]);
    console.log('Cart cleared');
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);

  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  // Common props for all pages that need cart functionality
  const cartProps = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartItemCount
  };

  const userProps = {
    currentUser,
    setCurrentUser,
    setIsLoggedIn,
    isLoggedIn
  };

  return (
    <StripeProvider>
      <Router>
        <Routes>
          {/* Home page */}
          <Route 
            path="/" 
            element={
              <HomePage 
                {...userProps}
                {...cartProps}
              />
            } 
          />

          {/* Restaurant menu page */}
          <Route 
            path="/restaurant" 
            element={
              <RestaurantDetail 
                {...userProps}
                {...cartProps}
              />
            } 
          />

          {/* Menu detail page - Pass addToCart and cart props */}
          <Route 
            path="/menudetail" 
            element={
              <MenuDetail 
                {...userProps}
                {...cartProps}
              />
            } 
          />

          {/* Contact Us page */}
          <Route 
            path="/contact-us" 
            element={
              <ContactUs 
                {...userProps}
                {...cartProps}
              />
            } 
          />
          
          {/* Authentication routes */}
          <Route 
            path="/signup" 
            element={
              <SignUp 
                users={users} 
                setUsers={setUsers} 
              />
            } 
          />
          <Route 
            path="/login" 
            element={
              <LogIn 
                users={users}
                setIsLoggedIn={setIsLoggedIn}
                setCurrentUser={setCurrentUser}
              />
            } 
          />

          {/* Order success page */}
          <Route 
            path="/order-success" 
            element={
              <OrderSuccess 
                currentUser={currentUser}
              />
            } 
          />

          {/* Payment page */}
          <Route 
            path="/payment" 
            element={
              <PaymentPage 
                {...cartProps}
                currentUser={currentUser}
              />
            }
          />
        </Routes>
      </Router>
    </StripeProvider>
  );
}

export default App;