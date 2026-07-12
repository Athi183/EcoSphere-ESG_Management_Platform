import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import RequireAuth from './components/common/RequireAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Departments from './pages/settings/Departments';
import Categories from './pages/settings/Categories';
import EmissionFactors from './pages/settings/EmissionFactors';

import Dashboard from './pages/dashboard/Dashboard';
import EnvironmentalLayout from './pages/environmental/EnvironmentalLayout';
import CarbonTransactions from './pages/environmental/CarbonTransactions';
import EnvironmentalDepartments from './pages/environmental/Departments';
import EnvironmentalCategories from './pages/environmental/Categories';
import EnvironmentalEmissionFactors from './pages/environmental/EmissionFactors';
import Gamification from './pages/gamification/Gamification';
import Social from './pages/social/Social';
import Reports from './pages/reports/Reports';

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
            element: <EnvironmentalLayout />,
            children: [
              {
                index: true,
                element: <CarbonTransactions />
              },
              {
                path: 'departments',
                element: <EnvironmentalDepartments />
              },
              {
                path: 'emission-factors',
                element: <EnvironmentalEmissionFactors />
              },
              {
                path: 'categories',
                element: <EnvironmentalCategories />
              }
            ]
          },
          {
            path: '/gamification',
            element: <Gamification />
          },
          {
            path: '/social',
            element: <Social />
          },
          {
            path: '/reports',
            element: <Reports />
          },
          // Admin-only Settings Routes
          {
            element: <RequireAuth allowedRoles={['admin']} />,
            children: [
              {
                path: '/settings/departments',
                element: <Departments />
              },
              {
                path: '/settings/categories',
                element: <Categories />
              },
              {
                path: '/settings/emission-factors',
                element: <EmissionFactors />
              }
            ]
          }
        ]
      }
    ]
  }
]);
