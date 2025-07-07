const BASE_URL = 'http://localhost:8000'; // Or whatever the backend URL is

export const endpoints = {
  signup: 'users/create/',
  login: 'api-token-auth/',
  gigs: 'gigs/',
  gigDetails: (id) => `gigs/${id}/`,
  gigsByFreelancer: (freelancerId) => `gigs/freelancer/${freelancerId}/`,

  buyerOrders: 'orders/buyer/',
  freelancerOrders: 'orders/freelancer/',
  orderDetail: (id) => `orders/${id}/`,
  createOrder: (gigId) => `orders/create/${gigId}/`,
  updateOrderStatus: (id) => `orders/update-status/${id}/`,
  repeatOrder: (id) => `orders/repeat/${id}/`,

  projects: 'projects/',
  projectDetail: (id) => `projects/${id}/`,
  createProject: 'projects/create/',
  updateProject: (id) => `projects/update/${id}/`,
  deleteProject: (id) => `projects/delete/${id}/`,
  reopenProject: (id) => `projects/reopen/${id}/`,
  placeBid: (projectId) => `projects/${projectId}/bid/`,
  acceptBid: (bidId) => `bids/accept/${bidId}/`,

  getUserByUsername: (username) => `users/${username}/`,
  profileDetail: (id) => `profiles/${id}/`,
  profileCompletion: 'profiles/completion/',

  reviews: 'reviews/',

  skills: 'skills/',
  categories: 'categories/',

  gigLists: 'gig-lists/',
  createGigList: 'gig-lists/create/',
  gigListDetail: (id) => `gig-lists/${id}/`,
  updateGigList: (id) => `gig-lists/update/${id}/`,
  deleteGigList: (id) => `gig-lists/delete/${id}/`,
  addGigToList: (listId, gigId) => `gig-lists/${listId}/add/${gigId}/`,
  removeGigFromList: (listId, gigId) => `gig-lists/${listId}/remove/${gigId}/`,
};

export const apiCall = async (endpoint, options = {}) => {
  // If the endpoint is 'api-token-auth/', do not prepend '/base/'
  const url = endpoint === 'api-token-auth/'
    ? `${BASE_URL}/${endpoint}`
    : `${BASE_URL}/base/${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Something went wrong');
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