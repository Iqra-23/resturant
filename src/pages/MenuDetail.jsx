import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

function MenuDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const params = new URLSearchParams(location.search);
      const productId = params.get('productId');

      console.log("🔍 productId from URL:", productId);

      if (!productId) {
        console.warn("⚠️ No productId in URL");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/products/${productId}`);
        const data = await res.json();

        console.log("✅ API Response:", data);

        if (!res.ok || !data || !data._id) {
          throw new Error(data.error || "Invalid product response");
        }

        setProduct(data);
      } catch (error) {
        console.error("❌ Fetch Error:", error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [location.search]);

  const handleGoBack = () => navigate(-1);
  const handleAddToCart = () => alert(`${product.name} added to cart!`);

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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 bg-black p-8 flex items-center justify-center">
          <div className="text-white text-xl">Product not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1 bg-black p-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={handleGoBack} className="mb-4 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
            ← Back to Menu
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-64 md:h-80">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-4">
              <div className="mb-3">
                <h1 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h1>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-green-600">Rs {product.price}</span>
                  <span className="text-yellow-500 text-sm">{product.rating} ⭐</span>
                </div>
                <p className="text-gray-600 text-xs mb-1">
                  <span className="font-semibold">Location:</span> {product.location}
                </p>
                <p className="text-gray-600 text-xs mb-2">
                  <span className="font-semibold">Category:</span> {product.category} | <span className="font-semibold">Prep Time:</span> {product.preparationTime}
                </p>
              </div>

              <p className="text-gray-700 mb-3 text-sm">{product.description}</p>

              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-xs">Ingredients:</h3>
                  <div className="flex flex-wrap gap-1">
                    {(product.ingredients || []).map((ingredient, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-xs">Nutrition:</h3>
                  <p className="text-gray-600 text-xs">{product.nutritionInfo || 'Not available'}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-xs">Allergens:</h3>
                  <div className="flex flex-wrap gap-1">
                    {(product.allergens || []).map((allergen, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={handleAddToCart} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold text-sm">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MenuDetail;
