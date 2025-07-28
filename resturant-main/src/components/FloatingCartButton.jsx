// src/components/FloatingCartButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingCartButton = ({ cart, cartTotal, onClick }) => {
  const navigate = useNavigate();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (itemCount === 0) return null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/payment');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={handleClick}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 p-4 flex items-center space-x-3 min-w-[120px]"
      >
        {/* Cart Icon */}
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2m5 8v6a2 2 0 002 2h6a2 2 0 002-2v-6m-4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4" />
          </svg>
          {/* Badge */}
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        </div>

        {/* Cart Info */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>
          <span className="text-xs opacity-90">
            Rs {cartTotal.toFixed(2)}
          </span>
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingCartButton;