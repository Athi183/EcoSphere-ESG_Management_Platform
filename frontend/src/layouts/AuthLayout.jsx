import React from 'react';
import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-env-900 overflow-hidden">
        <img
          src="/auth-bg.png"
          alt="EcoSphere Eco City"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-env-900/90 via-env-900/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
          <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">EcoSphere</h1>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Empowering your journey to sustainability.
          </h2>
          <p className="text-lg text-env-50 max-w-md opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Measure, manage, and improve your Environmental, Social, and Governance performance in real-time.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 sm:p-10 border border-gray-100 dark:border-slate-800 relative transition-colors duration-300">

          {/* Logo Header for Mobile (Hidden on Desktop) */}
          <div className="flex flex-col items-center justify-center mb-8 lg:hidden">
            <div className="w-16 h-16 bg-env-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-env-500/30">
              <Leaf className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">EcoSphere</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">ESG Management Platform</p>
          </div>

          <Outlet />

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
