import React from 'react';
import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-env-600 to-gov-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-env-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-env-500/30">
            <Leaf className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">EcoSphere</h1>
          <p className="text-gray-500 mt-1">ESG Management Platform</p>
        </div>

        {/* This is where the Login form will render */}
        <Outlet />
        
      </div>
    </div>
  );
};

export default AuthLayout;
