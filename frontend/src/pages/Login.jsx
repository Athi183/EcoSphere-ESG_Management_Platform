import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // TEMPORARY HACKATHON SHORTCUT: 
    // If backend isn't ready yet, let them bypass by clicking login with admin/admin
    if (email === 'admin' && password === 'admin') {
      const mockUser = { id: 1, name: 'Admin User', role: 'admin' };
      localStorage.setItem('access_token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Need to reload window to update auth state cleanly
      window.location.href = '/'; 
      return;
    }

    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid email or password');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Enter your credentials to access your dashboard.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-env-500 focus:border-env-500 sm:text-sm outline-none transition-colors"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-env-500 focus:border-env-500 sm:text-sm outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-env-600 hover:bg-env-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-env-500 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
      </button>

      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-env-600 hover:text-env-500">
            Register here
          </Link>
        </p>
      </div>

      <div className="text-center mt-6 text-xs text-gray-400">
        Hackathon Tip: Use <b>admin</b> / <b>admin</b> to bypass backend
      </div>
    </div>
  );
};

export default Login;
