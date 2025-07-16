import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ users, setIsLoggedIn, setCurrentUser }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      alert('Please fill in all fields');
      return;
    }
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      alert('Login successful!');
      navigate('/dashboard');
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Food Chow</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full pl-10 pr-12 py-3 border rounded-xl"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl"
          >
            Sign In
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Don't have an account?</p>
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-medium py-3 rounded-xl"
          >
            <UserPlus className="inline-block w-5 h-5 mr-2" />
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
