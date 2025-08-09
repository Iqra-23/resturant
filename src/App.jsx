import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RestaurantDetail from './pages/RestaurantMenu';
import MenuDetail from './pages/MenuDetail';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import ContactUs from './pages/ContactUs';
import OrderSuccess from './pages/OrderSuccess';
import PaymentPage from './pages/PaymentPage';

import { StripeProvider } from './contexts/StripeContext';

function App() {
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Error loading users from localStorage:', error);
        setUsers([]);
      }
    }

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
    setCartLoaded(true);

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

  useEffect(() => {
    if (cartLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, cartLoaded]);

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
          id: itemId,
          quantity: 1
        }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    if (!itemId) return;
    setCart(prevCart => prevCart.filter(item =>
      (item.id || item._id) !== itemId
    ));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (!itemId) return;
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
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);

  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

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

  if (!cartLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <StripeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<HomePage {...userProps} {...cartProps} />}
          />
          <Route
            path="/restaurant" // ✅ CORRECTED back to original
            element={<RestaurantDetail {...userProps} {...cartProps} />}
          />
          <Route
            path="/menudetail"
            element={<MenuDetail {...userProps} {...cartProps} />}
          />
          <Route
            path="/contact-us"
            element={<ContactUs {...userProps} {...cartProps} />}
          />
          <Route
            path="/signup"
            element={<SignUp users={users} setUsers={setUsers} />}
          />
          <Route
            path="/login"
            element={<LogIn users={users} setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />}
          />
          <Route
            path="/order-success"
            element={<OrderSuccess currentUser={currentUser} />}
          />
          <Route
            path="/payment"
            element={<PaymentPage {...cartProps} currentUser={currentUser} />}
          />
        </Routes>
      </Router>
    </StripeProvider>
  );
}

export default App;
