import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Send login request to backend
      const response = await api.post('/auth/login', { email, password });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      // The backend returns the token nested in response.data.data
      const { access_token } = response.data.data;

      // Save token to local storage so api.js can use it for the next request
      localStorage.setItem('access_token', access_token);

      // Now fetch the actual user profile using the token
      const userResponse = await api.get('/auth/me');
      
      if (!userResponse.data.success) {
        throw new Error(userResponse.data.message || 'Failed to fetch user profile');
      }
      
      const userData = userResponse.data.data;

      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Login failed', error);
      // Ensure we extract the correct error message whether it's HTTP 200 {success: false} or HTTP 400
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, department_id = 1) => {
    setLoading(true);
    try {
      // Backend expects role to be employee by default
      const response = await api.post('/auth/register', {
        full_name: name,
        email,
        password,
        role: 'employee',
        department_id
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration failed', error);
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (!Array.isArray(roles)) roles = [roles];
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
