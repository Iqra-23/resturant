import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

function RestaurantDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate(); // Add this import
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [restaurantData, setRestaurantData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const restaurant = params.get('selected');
    if (restaurant) {
      setSelectedRestaurant(restaurant);
    }

    // Fetch restaurant data from API
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/restaurants`);
        const data = await response.json();

        if (response.ok) {
          setRestaurantData(data); // Set the fetched data
        } else {
          console.error('Failed to fetch restaurant data');
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchRestaurantData();
  }, [location.search]);

  const handleProductClick = (productId) => {
    // Navigate to menudetail page with product ID
    navigate(`/menudetail?productId=${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 bg-black p-8 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1 bg-black p-8">
        <h1 className="text-3xl text-center font-bold text-white mb-6">
          Welcome to {selectedRestaurant || 'Our Restaurants'}! 🍔
        </h1>

        {selectedRestaurant ? (
          restaurantData
            .filter(restaurant => restaurant.name.toLowerCase() === selectedRestaurant.toLowerCase())
            .map((restaurant) => (
              <div key={restaurant.name}>
                {/* Grid layout for displaying products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {restaurant.products.map((product) => (
                    <div 
                      key={product.id}
                      className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
                      onClick={() => handleProductClick(product.id)} // Handle product click
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="rounded-lg w-full mb-4 h-48 object-cover" // Fixed height
                      />
                      <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                      <p className="text-lg text-gray-600 mt-2">{product.location}</p>
                      <p className="text-lg text-gray-600 mt-1">Price: {product.price}</p>
                      <p className="text-lg text-gray-600 mt-1">Rating: {product.rating} ⭐</p>
                      <p className="text-gray-700 mt-4">{product.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <p className="text-lg text-gray-700">
            Please select a restaurant from the dropdown menu on the previous page.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default RestaurantDetailsPage;
