import api from './api';
import { LoginResponse } from '../types/auth';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  // Mock login for now, we can wire it up to real API later
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: '1',
          firstName: 'Admin',
          lastName: 'User',
          email,
          role: 'ADMIN' as any,
        },
        token: 'mock-jwt-token-12345',
      });
    }, 1000);
  });
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
