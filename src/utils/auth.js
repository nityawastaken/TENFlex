import { apiCall, endpoints } from './api';

// Authentication service for Django backend
export const authService = {
  // Sign up a new user
  async signup(userData) {
    try {
      const response = await apiCall(endpoints.signup, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user and get token
  async login(credentials) {
    try {
      const response = await apiCall(endpoints.login, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user || {}));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Redirect to login page or home
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  },

  // Get current user from localStorage
  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  },

  // Get auth token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  // Update user data in localStorage
  updateUserData(userData) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  },
};

// Protected route wrapper
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    if (typeof window !== 'undefined' && !authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      window.location.href = '/signin';
      return null;
    }
    return <WrappedComponent {...props} />;
  };
}; 