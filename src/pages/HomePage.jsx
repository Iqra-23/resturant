import React from 'react';
import Navbar from '../components/NavBar'; // Import Navbar component
import Body from '../components/Body'; // Import Body component
import Footer from '../components/Footer'; // Import Footer component
import BottomFooter from '../components/BottomFooter'; // Import BottomFooter component

const HomePage = ({
  cart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  cartTotal,
  cartItemCount,
  currentUser,
  setCurrentUser,
  setIsLoggedIn,
  isLoggedIn
}) => {
  return (
    <div className="App">
      {/* Components specific to the Home Page */}
      <Navbar 
        cartItemCount={cartItemCount}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
        cart={cart}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        cartTotal={cartTotal}
        addToCart={addToCart}
      />
      <Body 
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        cartTotal={cartTotal}
        cartItemCount={cartItemCount}
        currentUser={currentUser}
      />
      <Footer />
      <BottomFooter />
    </div>
  );
};

export default HomePage;