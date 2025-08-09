import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn, setCurrentUser }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ Store token and user
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }));

        if (typeof setIsLoggedIn === 'function') setIsLoggedIn(true);
        if (typeof setCurrentUser === 'function') setCurrentUser({ ...data.user, token: data.token });

        setLoginData({ email: '', password: '' });
        navigate('/');
      } else {
        setError(data.message || data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) handleLogin();
  };

  const handleInputChange = (field, value) => {
    setLoginData({ ...loginData, [field]: value });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Food Chow account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              value={loginData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full pl-10 pr-12 py-3 border rounded-xl"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Don't have an account?</p>
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-yellow-100 hover:bg-yellow-200 text-gray-800 py-3 rounded-xl"
          >
            <UserPlus className="w-5 h-5 inline mr-2" />
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
