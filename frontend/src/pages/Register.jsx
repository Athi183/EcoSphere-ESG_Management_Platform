import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Create an Account</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Join EcoSphere and start your sustainability journey.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-env-500 focus:border-env-500 sm:text-sm outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-env-500 focus:border-env-500 sm:text-sm outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-env-500 focus:border-env-500 sm:text-sm outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-gray-900 bg-env-400 hover:bg-env-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-env-500 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Register'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-env-600 dark:text-env-400 hover:text-env-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
