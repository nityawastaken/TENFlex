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
      // Always fetch the full user profile after signup
      let profile = null;
      const token = this.getToken();
      try {
        profile = await this.fetchUserData(token);
      } catch (err) {
        console.error("Error fetching user data after signup:", err);
      }
      if (profile) {
        localStorage.setItem('user', JSON.stringify(profile));
      } else if (response && response.id) {
        localStorage.setItem('user', JSON.stringify(response));
      }
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
        localStorage.setItem('token', response.token);
        let userData = null;
        try {
          // Step 1: Get user id by username
          const userMin = await apiCall(endpoints.getUserByUsername(credentials.username), {
            headers: { Authorization: `Token ${response.token}` }
          });
          // Step 2: Get full user profile by id
          if (userMin && userMin.id) {
            userData = await apiCall(endpoints.profileDetail(userMin.id), {
              headers: { Authorization: `Token ${response.token}` }
            });
          }
          } catch (err) {
            console.error("Error fetching user data after login:", err);
          }
        if (userData) {
          userData.token = response.token;
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userMin', JSON.stringify(userData));
        } else {
          // fallback: store only token, but this should not happen
          localStorage.setItem('user', JSON.stringify({ token: response.token }));
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Fetch user data using token
  async fetchUserData(token) {
    try {
      // Get user ID from JWT token if possible
      const userId = this.getUserIdFromToken(token);
      
      if (userId) {
        // Fetch specific user data using ID
        const response = await apiCall(`users/${userId}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        return response;
      } else {
        // Try to get current user data using backend endpoint
      const response = await apiCall('users/me/', {
        headers: { Authorization: `Token ${token}` }
      });
      return response;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  },
  
  // Try to extract user ID from token
  getUserIdFromToken(token) {
    try {
      // Simple JWT token parser - ONLY works if token contains user ID in payload
      // This is a best effort attempt; different backends structure tokens differently
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      return payload.user_id || payload.id || null;
    } catch (e) {
      console.log("Could not parse token for user ID");
      return null;
    }
  },

  // Validate token with backend
  async validateToken() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Call an endpoint that requires authentication
      await apiCall('users/get-completion-percentage/', {
        headers: { Authorization: `Token ${token}` }
      });
      return true;
    } catch (error) {
      // If token is invalid, clear auth data
      if (error.status === 401) {
        this.logout(false); // Don't redirect
        return false;
      }
      // For other errors, assume token is still valid
      return true;
    }
  },

  // Logout user
  logout(redirect = true) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page or home
    if (redirect && typeof window !== 'undefined') {
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
      return !!localStorage.getItem('token');
    }
    return false;
  },

  // Get auth token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Update user data in localStorage
  updateUserData(userData) {
    if (typeof window !== 'undefined') {
      // Preserve token if it exists
      const token = this.getToken();
      if (token && !userData.token) {
        userData.token = token;
      }
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