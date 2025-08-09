import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import logo from '../assets/logo.png'; // Adjust path if necessary

const SideNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Handle sidebar open/close
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Handle dropdown toggle
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRestaurantSelect = (restaurant) => {
    navigate(`/restaurant?selected=${restaurant.toLowerCase()}`);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          className="text-white bg-gray-900 p-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar visibility
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-white w-64 h-full p-6 flex flex-col">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-8">
                <img className="h-16 w-auto" src={logo} alt="Logo" />
                <button
                  onClick={() => setIsSidebarOpen(false)} // Close the sidebar
                  className="text-gray-700 text-2xl"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="text-lg text-gray-800 font-semibold py-2 px-4 hover:bg-gray-200 rounded-md"
                >
                  Home
                </button>

                {/* Dropdown for Restaurants */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
                    className="text-lg text-gray-800 font-semibold py-2 px-4 hover:bg-gray-200 w-full text-left rounded-md"
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
                    <div className="absolute left-0 mt-2 bg-white rounded-md shadow-lg w-full">
                      <button
                        onClick={() => handleRestaurantSelect('KFC')}
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        KFC
                      </button>
                      <button
                        onClick={() => handleRestaurantSelect('Cheezious')}
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Cheezious
                      </button>
                      <button
                        onClick={() => handleRestaurantSelect('Ranchers')}
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Ranchers
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate('/contact-us')}
                  className="text-lg text-gray-800 font-semibold py-2 px-4 hover:bg-gray-200 w-full text-left rounded-md"
                >
                  Contact Us
                </button>



              </div>
              
            </div>
          </div>
        )}
      </div>

      {/* Navbar for Desktop */}
      <nav className="hidden md:flex bg-white shadow-md font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-auto items-center py-4">
            {/* Left Side: Logo + Buttons */}
            <div className="flex items-center gap-x-6 mb-4 md:mb-0">
              <div className="flex-shrink-0">
                <img className="h-20 w-auto" src={logo} alt="Company Logo" />
              </div>

              <div className="flex items-center gap-x-6 lg:gap-x-8">
                <button
                  onClick={() => navigate('/')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-lg font-extrabold rounded-md transition-colors duration-200"
                >
                  HOMEPAGES
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-lg font-extrabold rounded-md transition-colors duration-200 flex items-center gap-2"
                  >
                    RESTAURANTS
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
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
                        <button
                          onClick={() => handleRestaurantSelect('KFC')}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        >
                          KFC
                        </button>
                        <button
                          onClick={() => handleRestaurantSelect('Cheezious')}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        >
                          Cheezious
                        </button>
                        <button
                          onClick={() => handleRestaurantSelect('Ranchers')}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        >
                          Ranchers
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate('/contact-us')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-lg font-extrabold rounded-md transition-colors duration-200"
                >
                  CONTACT US
                </button>
              </div>
            </div>

            {/* Right Side: Register Button */}
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/register-restaurant')}
                className="bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-lg text-base font-semibold shadow-lg transition-colors duration-200"
              >
                REGISTER
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNavbar;
