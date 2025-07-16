// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage'; // Import the HomePage
import RestaurantDetail from './pages/RestaurantMenu';
import MenuDetail from './pages/MenuDetail'; // Import the MenuDetail page
import SignUp from './pages/SignUp'; // Import SignUp page
import LogIn from './pages/LogIn'; // Import LogIn page

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurant" element={<RestaurantDetail />} />
        <Route path="/menudetail" element={<MenuDetail />} />
        <Route path="/signup" element={<SignUp />} /> {/* SignUp page route */}
        <Route path="/login" element={<LogIn />} /> {/* LogIn page route */}
      </Routes>
    </Router>
  );
}

export default App;
