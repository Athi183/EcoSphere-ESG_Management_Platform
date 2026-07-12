<<<<<<< HEAD
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { router } from './router';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
=======
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">EcoSphere Frontend</h1>
    </div>
>>>>>>> 4cacb627b2973d8f21191a2ee5485f3cb6ce23a0
  );
}

export default App;
