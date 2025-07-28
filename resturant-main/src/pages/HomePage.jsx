import React from 'react';
import Navbar from '../components/NavBar'; // Import Navbar component
import Body from '../components/Body'; // Import Body component
import Footer from '../components/Footer'; // Import Footer component
import BottomFooter from '../components/BottomFooter'; // Import BottomFooter component

const HomePage = () => {
  return (
    <div className="App">
      {/* Components specific to the Home Page */}
      <Navbar />
      <Body />
      <Footer />
      <BottomFooter />
    </div>
  );
};

export default HomePage;
