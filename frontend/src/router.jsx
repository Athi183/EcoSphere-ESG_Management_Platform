import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';

// Placeholder for Dashboard
const Dashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p className="mt-2 text-gray-600">Welcome to EcoSphere ESG Platform</p>
  </div>
);

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
    ],
  },
]);
