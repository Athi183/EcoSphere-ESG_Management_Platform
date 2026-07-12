import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import RequireAuth from './components/common/RequireAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import EmissionFactors from './pages/settings/EmissionFactors';

// Placeholder for the main dashboard until we build it
const DashboardPlaceholder = () => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">You are successfully logged in!</h2>
    <p className="text-gray-500">Phase 3 (The Dashboard) is ready to be built next.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    // Public routes (Auth)
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      }
    ]
  },
  {
    // Protected routes (Dashboard)
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <DashboardPlaceholder />
          },
          {
            path: '/settings/emission-factors',
            element: <EmissionFactors />
          }
          // Future routes will go here (e.g. /environmental, /social)
        ]
      }
    ]
  }
]);
