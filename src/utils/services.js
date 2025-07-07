import { apiCall, endpoints } from './api';

// Gig services
export const gigService = {
  // Get all gigs
  async getAllGigs(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `${endpoints.gigs}?${queryParams}` : endpoints.gigs;
    return await apiCall(endpoint);
  },

  // Get gig by ID
  async getGigById(id) {
    return await apiCall(endpoints.gigDetails(id));
  },

  // Create new gig
  async createGig(gigData) {
    return await apiCall(endpoints.gigs, {
      method: 'POST',
      body: JSON.stringify(gigData),
    });
  },

  // Update gig
  async updateGig(id, gigData) {
    return await apiCall(endpoints.gigDetails(id), {
      method: 'PUT',
      body: JSON.stringify(gigData),
    });
  },

  // Delete gig
  async deleteGig(id) {
    return await apiCall(endpoints.gigDetails(id), {
      method: 'DELETE',
    });
  },

  // Get gigs by freelancer
  async getGigsByFreelancer(freelancerId) {
    return await apiCall(endpoints.gigsByFreelancer(freelancerId));
  },
};

// Order services
export const orderService = {
  // Get buyer orders
  async getBuyerOrders() {
    return await apiCall(endpoints.buyerOrders);
  },

  // Get freelancer orders
  async getFreelancerOrders() {
    return await apiCall(endpoints.freelancerOrders);
  },

  // Get order by ID
  async getOrderById(id) {
    return await apiCall(endpoints.orderDetail(id));
  },

  // Create order from gig
  async createOrder(gigId, orderData) {
    return await apiCall(endpoints.createOrder(gigId), {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Update order status
  async updateOrderStatus(id, status) {
    return await apiCall(endpoints.updateOrderStatus(id), {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Repeat order
  async repeatOrder(id) {
    return await apiCall(endpoints.repeatOrder(id), {
      method: 'POST',
    });
  },
};

// Project services
export const projectService = {
  // Get all projects
  async getAllProjects(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `${endpoints.projects}?${queryParams}` : endpoints.projects;
    return await apiCall(endpoint);
  },

  // Get project by ID
  async getProjectById(id) {
    return await apiCall(endpoints.projectDetail(id));
  },

  // Create new project
  async createProject(projectData) {
    return await apiCall(endpoints.createProject, {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  // Update project
  async updateProject(id, projectData) {
    return await apiCall(endpoints.updateProject(id), {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  // Delete project
  async deleteProject(id) {
    return await apiCall(endpoints.deleteProject(id), {
      method: 'DELETE',
    });
  },

  // Reopen project
  async reopenProject(id) {
    return await apiCall(endpoints.reopenProject(id), {
      method: 'POST',
    });
  },

  // Place bid on project
  async placeBid(projectId, bidData) {
    return await apiCall(endpoints.placeBid(projectId), {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  },

  // Accept bid
  async acceptBid(bidId) {
    return await apiCall(endpoints.acceptBid(bidId), {
      method: 'POST',
    });
  },
};

// User services
export const userService = {
  // Get user by username
  async getUserByUsername(username) {
    return await apiCall(endpoints.getUserByUsername(username));
  },

  // Get user profile
  async getUserProfile(id) {
    return await apiCall(endpoints.profileDetail(id));
  },

  // Update user profile
  async updateUserProfile(id, profileData) {
    return await apiCall(endpoints.profileDetail(id), {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Get profile completion percentage
  async getProfileCompletion() {
    return await apiCall(endpoints.profileCompletion);
  },
};

// Review services
export const reviewService = {
  // Get all reviews
  async getAllReviews(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `${endpoints.reviews}?${queryParams}` : endpoints.reviews;
    return await apiCall(endpoint);
  },

  // Create review
  async createReview(reviewData) {
    const token = localStorage.getItem('authToken');
    return await apiCall(endpoints.reviews, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {}),
      },
      body: JSON.stringify(reviewData),
    });
  },

  // Update review
  async updateReview(id, reviewData) {
    return await apiCall(`${endpoints.reviews}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review
  async deleteReview(id) {
    return await apiCall(`${endpoints.reviews}${id}/`, {
      method: 'DELETE',
    });
  },
};

// Skills and Categories services
export const skillService = {
  // Get all skills
  async getAllSkills() {
    return await apiCall(endpoints.skills);
  },
};

export const categoryService = {
  // Get all categories
  async getAllCategories() {
    return await apiCall(endpoints.categories);
  },
};

// Gig List services
export const gigListService = {
  // Get all gig lists
  async getAllGigLists() {
    return await apiCall(endpoints.gigLists);
  },

  // Create gig list
  async createGigList(listData) {
    return await apiCall(endpoints.createGigList, {
      method: 'POST',
      body: JSON.stringify(listData),
    });
  },

  // Get gig list by ID
  async getGigListById(id) {
    return await apiCall(endpoints.gigListDetail(id));
  },

  // Update gig list
  async updateGigList(id, listData) {
    return await apiCall(endpoints.updateGigList(id), {
      method: 'PUT',
      body: JSON.stringify(listData),
    });
  },

  // Delete gig list
  async deleteGigList(id) {
    return await apiCall(endpoints.deleteGigList(id), {
      method: 'DELETE',
    });
  },

  // Add gig to list
  async addGigToList(listId, gigId) {
    return await apiCall(endpoints.addGigToList(listId), {
      method: 'POST',
      body: JSON.stringify({ gig_id: gigId }),
    });
  },

  // Remove gig from list
  async removeGigFromList(listId, gigId) {
    return await apiCall(endpoints.removeGigFromList(listId), {
      method: 'POST',
      body: JSON.stringify({ gig_id: gigId }),
    });
  },
}; 