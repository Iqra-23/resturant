import React, { useState } from 'react';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError('');
    setLoading(true);

    // Frontend validation
    const { name, email, password, confirmPassword } = signupData;
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }

    // Password length validation (matches backend validation)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Make API call to backend signup endpoint
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear form on successful signup
        setSignupData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        // Show success message and navigate to login
        alert('Account created successfully! Please login.');
        navigate('/login');
      } else {
        // Handle error from backend
        setError(data.error || data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSignupData({ ...signupData, [field]: value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Food Chow</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              value={signupData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              value={signupData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
              value={signupData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </div>
          ) : (
            'Sign Up'
          )}
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Already have an account?</p>
          <button
            onClick={() => navigate('/login')}
            disabled={loading}
            className="w-full bg-yellow-100 hover:bg-yellow-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 font-medium py-3 rounded-xl transition-colors duration-200 flex items-center justify-center"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;