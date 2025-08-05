const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Or whatever the backend URL is

export const endpoints = {
  // Auth endpoints
  signup: 'users/create/',
  login: 'api-token-auth/',
  
  // Gig endpoints
  gigs: 'gigs/',
  gigDetails: (id) => `gigs/${id}/`,
  gigsByFreelancer: (freelancerId) => `user/${freelancerId}/gigs/`,

  // Order endpoints
  buyerOrders: 'buyer/orders/',
  freelancerOrders: 'freelancer/orders/',
  orderDetail: (id) => `orders/${id}/`,
  createOrder: (gigId) => `orders/gigs/${gigId}/book/`,
  updateOrderStatus: (id) => `orders/${id}/update-status/`,
  repeatOrder: (id) => `orders/${id}/repeat/`,

  // Project endpoints
  projects: 'projects/',
  createProject: 'projects/create/',
  updateProject: (id) => `projects/${id}/update/`,
  deleteProject: (id) => `projects/${id}/delete/`,
  reopenProject: (id) => `projects/${id}/reopen/`,
  placeBid: (projectId) => `projects/${projectId}/bid/`,
  acceptBid: (bidId) => `bids/${bidId}/accept/`,

  // User profile endpoints
  getUserByUsername: (username) => `get_user_by_username/${username}/`,
  profileDetail: (id) => `users/${id}/`,
  profileCompletion: 'users/get-completion-percentage/',

  // Review endpoints
  reviews: 'reviews/',

  // Skills and Categories
  skills: 'skills/',
  categories: 'categories/',

  // Gig list endpoints
  gigLists: 'giglists/',
  createGigList: 'giglists/create/',
  gigListDetail: (id) => `giglists/${id}/`,
  updateGigList: (id) => `giglists/${id}/update/`,
  deleteGigList: (id) => `giglists/${id}/delete/`,
  addGigToList: (listId) => `giglists/${listId}/gigs/add/`,
  removeGigFromList: (listId) => `giglists/${listId}/gigs/remove/`,
};

export const apiCall = async (endpoint, options = {}) => {
  // If the endpoint is 'api-token-auth/', do not prepend '/base/'
  const url = endpoint === 'api-token-auth/'
    ? `${BASE_URL}/${endpoint}`
    : `${BASE_URL}/base/${endpoint}`;

  // Get token from localStorage if available
  let headers = { ...options.headers };
  
  // Try to get token from different possible locations
  let token = null;
  
  // First, try to get from 'user' object
  const user = localStorage.getItem('user');
  if (user) {
    try {
    const userData = JSON.parse(user);
    if (userData && userData.token) {
        token = userData.token;
      }
    } catch (e) {
      console.warn('Failed to parse user data from localStorage');
    }
  }
  
  // If no token found, try to get from separate 'token' key
  if (!token) {
    token = localStorage.getItem('token');
  }
  
  // Add authorization header if token is available
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  // Only set Content-Type if body is a string (JSON), not FormData
  if (typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }
  // If body is FormData, do NOT set Content-Type (let browser handle it)

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      // Prefer 'detail', then 'message', then statusText, then fallback
      const errorMsg = errorData.detail || errorData.message || response.statusText || 'Something went wrong';
      throw new Error(errorMsg);
    }
    // For DELETE requests, response might not have a body
    if (response.status === 204) {
        return;
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}; 