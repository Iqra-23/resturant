// src/components/CartIcon.jsx
import React from 'react';

const CartIcon = ({ cart = [], onClick }) => {
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const cartTotal = cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
        aria-label={`Cart with ${itemCount} items`}
        type="button"
      >
        {/* Cart Icon */}
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H2m5 8v6a2 2 0 002 2h6a2 2 0 002-2v-6m-4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4" 
          />
        </svg>
        
        {/* Badge */}
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] animate-pulse">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>

      {/* Quick Cart Preview (Tooltip) - Only shows on desktop hover */}
      {itemCount > 0 && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">Quick View</span>
              <span className="text-sm text-gray-500">{itemCount} items</span>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cart.slice(0, 3).map((item) => (
                <div key={item.id || item._id} className="flex justify-between items-center text-sm">
                  <div className="flex-1 truncate">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-1">×{item.quantity}</span>
                  </div>
                  <span className="font-semibold">Rs {((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                </div>
              ))}
              {cart.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{cart.length - 3} more items...
                </div>
              )}
            </div>
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span className="text-green-600">Rs {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartIcon;