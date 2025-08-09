import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

function RestaurantDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const restaurantId = params.get('selected');
    
    if (!restaurantId) {
      setError('No restaurant selected');
      setLoading(false);
      return;
    }

    console.log('Restaurant identifier:', restaurantId);

    console.log('Restaurant ID from URL:', restaurantId);
    console.log('Restaurant ID length:', restaurantId.length);

    // Fetch products for this restaurant
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch restaurant data
        console.log(`Fetching restaurant data for: ${restaurantId}`);
        const restaurantResponse = await fetch(`http://localhost:3000/api/restaurants/${restaurantId}`);
        
        console.log('Restaurant response status:', restaurantResponse.status);
        
        if (restaurantResponse.ok) {
          const restaurantData = await restaurantResponse.json();
          console.log('Restaurant data:', restaurantData);
          setSelectedRestaurant(restaurantData);
        } else if (restaurantResponse.status === 404) {
          setError('Restaurant not found');
          return;
        } else if (restaurantResponse.status === 400) {
          const errorText = await restaurantResponse.text();
          console.error('Bad request error:', errorText);
          setError(`Invalid restaurant ID format: ${errorText}`);
          return;
        } else {
          const errorText = await restaurantResponse.text();
          console.error('Restaurant fetch error:', restaurantResponse.status, errorText);
          setError(`Failed to fetch restaurant data: ${restaurantResponse.status}`);
          return;
        }

        // Fetch products for this restaurant
        console.log(`Fetching products for restaurant: ${restaurantId}`);
        const productsResponse = await fetch(`http://localhost:3000/api/restaurants/${restaurantId}/products`);
        
        console.log('Products response status:', productsResponse.status);
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('Products data:', productsData);
          setProducts(productsData);
        } else if (productsResponse.status === 404) {
          // No products found for this restaurant
          console.log('No products found for this restaurant');
          setProducts([]);
        } else {
          const errorText = await productsResponse.text();
          console.error('Products fetch error:', productsResponse.status, errorText);
          // Don't fail the whole page if products can't be fetched
          setProducts([]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Network error: ${error.message}. Please check if the server is running.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleProductClick = (productId) => {
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 bg-black p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error: {error}</div>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
            >
              Go Back to Home
            </button>
          </div>
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
          Welcome to {selectedRestaurant ? selectedRestaurant.title : 'Restaurant'}
        </h1>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product._id}
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
                onClick={() => handleProductClick(product._id)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="rounded-lg w-full mb-4 h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-lg text-gray-600 mt-2">{product.location}</p>
                <p className="text-lg text-gray-600 mt-1">Price: {product.price}</p>
                <p className="text-lg text-gray-600 mt-1">Rating: {product.rating} ⭐</p>
                <p className="text-gray-700 mt-4">{product.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white">
            <p className="text-lg">No products available for this restaurant yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default RestaurantDetailsPage;