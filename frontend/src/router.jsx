import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import RequireAuth from './components/common/RequireAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import EmissionFactors from './pages/settings/EmissionFactors';

import Dashboard from './pages/dashboard/Dashboard';
import CarbonTransactions from './pages/environmental/CarbonTransactions';
import Gamification from './pages/gamification/Gamification';
import Social from './pages/social/Social';

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
            element: <Dashboard />
          },
          {
            path: '/environmental',
            element: <CarbonTransactions />
          },
          {
            path: '/settings/emission-factors',
            element: <EmissionFactors />
          },
          {
            path: '/gamification',
            element: <Gamification />
          },
          {
            path: '/social',
            element: <Social />
          }
        ]
      }
    ]
  }
]);
