import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RequireAuth = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // If they aren't logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If this route requires specific roles and user doesn't have it, redirect to dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the child routes!
  return <Outlet />;
};

export default RequireAuth;
