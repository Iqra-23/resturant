import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRestaurantSelect = (restaurant) => {
    console.log(`Selected restaurant: ${restaurant}`);
    navigate(`/restaurant?selected=${restaurant.toLowerCase()}`);
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
  };

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

              {/* Login Button */}
              <div className="mt-6">
                <button
                  onClick={() => { navigate('/login'); setIsSidebarOpen(false); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md w-full text-base"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-white shadow-md font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center py-4">
            {/* Left: Logo and Nav Buttons */}
            <div className="flex items-center gap-x-6">
              <img className="h-20 w-auto" src={logo} alt="Company Logo" />

              <div className="flex items-center gap-x-6 lg:gap-x-8">
                <button onClick={() => navigate('/')} className={buttonStyles}>
                  HOMEPAGE
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`${buttonStyles} flex items-center justify-between`}
                  >
                    RESTAURANTS
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
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        {['KFC', 'Cheezious', 'Ranchers'].map((res) => (
                          <button
                            key={res}
                            onClick={() => handleRestaurantSelect(res)}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => navigate('/contact-us')} className={buttonStyles}>
                  CONTACT US
                </button>
              </div>
            </div>

            {/* Right: Login & Register */}
            <div className="flex items-center gap-x-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md text-base transition"
              >
                LOGIN
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md text-base transition"
              >
                REGISTER
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
