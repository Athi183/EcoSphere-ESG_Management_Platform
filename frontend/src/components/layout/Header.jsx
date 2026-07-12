import React from 'react';
import { Bell, Search, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-env-500 focus:outline-none focus:ring-1 focus:ring-env-500 sm:text-sm"
            placeholder="Search..."
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center md:ml-6 space-x-4">
        <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-env-500 focus:ring-offset-2">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="relative ml-3 group">
          <div className="flex items-center cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-env-100">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full" />
              ) : (
                <UserIcon className="h-5 w-5 text-env-600" />
              )}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">{user?.firstName}</span>
          </div>
          
          <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
            <button
              onClick={logout}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
