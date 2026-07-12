import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { LogOut, Leaf, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Environmental', path: '/environmental' },
    { name: 'Social', path: '/social' },
    { name: 'Gamification', path: '/gamification' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings/emission-factors' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* Sticky Top Navbar */}
      <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-slate-800/80 shadow-sm transition-all duration-300">
        
        {/* Main Header Row */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-2 text-env-600 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-env-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-env-600" />
            </div>
            EcoSphere
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-env-600 hover:bg-env-50 dark:text-gray-400 dark:hover:text-env-400 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
            
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                {user?.full_name || user?.name || 'User'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium capitalize">
                {user?.role || 'Employee'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-env-500 to-env-400 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
              {(user?.full_name || user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Secondary Navigation (Tabs) */}
        <div className="px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'border-env-600 text-env-700 dark:text-env-400 dark:border-env-500'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
