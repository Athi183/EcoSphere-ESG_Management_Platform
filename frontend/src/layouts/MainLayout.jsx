import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2 text-env-600 font-bold text-xl">
          <Leaf className="w-6 h-6" /> EcoSphere
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, <b>{user?.name || 'User'}</b> ({user?.role || 'employee'})
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard pages will render here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
