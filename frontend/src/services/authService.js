export const login = async (email, password) => {
  // Mock login for now, we can wire it up to real API later
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: '1',
          firstName: 'Admin',
          lastName: 'User',
          email,
          role: 'ADMIN',
        },
        token: 'mock-jwt-token-12345',
      });
    }, 1000);
  });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
