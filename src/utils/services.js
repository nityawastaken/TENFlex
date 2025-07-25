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

  // Create new gig (use FormData for picture, otherwise JSON)
  async createGig(gigData) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', gigData.title);
    formData.append('description', gigData.description);
    formData.append('price', gigData.price);
    formData.append('delivery_time', gigData.delivery_time);
    
    // Add picture if available
    if (gigData.picture) {
      formData.append('picture', gigData.picture);
    }
    
    // Add categories
    if (gigData.category_ids && Array.isArray(gigData.category_ids)) {
      gigData.category_ids.forEach(id => formData.append('category_ids', id));
    } else if (gigData.category_ids) {
      formData.append('category_ids', gigData.category_ids);
    }
    
    // Add skills
    if (gigData.skill_names && Array.isArray(gigData.skill_names)) {
      gigData.skill_names.forEach(name => formData.append('skill_names', name));
    } else if (gigData.skill_names) {
      formData.append('skill_names', gigData.skill_names);
    }
    
    // Direct fetch to have more control over the FormData
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/${endpoints.gigs}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Failed to create gig');
    }
    
    return await response.json();
  },

  // Update gig
  async updateGig(id, gigData) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Add text fields
    if (gigData.title) formData.append('title', gigData.title);
    if (gigData.description) formData.append('description', gigData.description);
    if (gigData.price) formData.append('price', gigData.price);
    if (gigData.delivery_time) formData.append('delivery_time', gigData.delivery_time);
    
    // Add picture if available
    if (gigData.picture instanceof File) {
      formData.append('picture', gigData.picture);
    }
    
    // Add categories
    if (gigData.category_ids && Array.isArray(gigData.category_ids)) {
      gigData.category_ids.forEach(id => formData.append('category_ids', id));
    } else if (gigData.category_ids) {
      formData.append('category_ids', gigData.category_ids);
    }
    
    // Add skills
    if (gigData.skill_names && Array.isArray(gigData.skill_names)) {
      gigData.skill_names.forEach(name => formData.append('skill_names', name));
    } else if (gigData.skill_names) {
      formData.append('skill_names', gigData.skill_names);
    }
    
    // Direct fetch to have more control over the FormData
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/base/${endpoints.gigDetails(id)}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Failed to update gig');
    }
    
    return await response.json();
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
  async getBuyerOrders() {
    return await apiCall(endpoints.buyerOrders);
  },
  async getFreelancerOrders() {
    return await apiCall(endpoints.freelancerOrders);
  },
  async getOrderById(id) {
    return await apiCall(endpoints.orderDetail(id));
  },
  async createOrder(gigId, orderData) {
    return await apiCall(endpoints.createOrder(gigId), {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  async updateOrderStatus(id, status) {
    return await apiCall(endpoints.updateOrderStatus(id), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  async repeatOrder(id) {
    return await apiCall(endpoints.repeatOrder(id), {
      method: 'POST',
    });
  },
};

// Project services
export const projectService = {
  async getAllProjects(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `${endpoints.projects}?${queryParams}` : endpoints.projects;
    return await apiCall(endpoint);
  },
  async getProjectById(id) {
    return await apiCall(endpoints.projectDetail(id));
  },
  async createProject(projectData) {
    return await apiCall(endpoints.createProject, {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },
  async updateProject(id, projectData) {
    return await apiCall(endpoints.updateProject(id), {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },
  async deleteProject(id) {
    return await apiCall(endpoints.deleteProject(id), {
      method: 'DELETE',
    });
  },
  async reopenProject(id) {
    return await apiCall(endpoints.reopenProject(id), {
      method: 'POST',
    });
  },
  async placeBid(projectId, bidData) {
    return await apiCall(endpoints.placeBid(projectId), {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  },
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
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    return await apiCall(endpoints.profileDetail(id), {
      headers: token ? { Authorization: `Token ${token}` } : {},
    });
  },

  // Update user profile
  async updateUserProfile(id, profileData, useFormData = false) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    return await apiCall(endpoints.profileDetail(id), {
      method: 'PUT',
      body: useFormData ? profileData : JSON.stringify(profileData),
      headers: {
        ...(token ? { Authorization: `Token ${token}` } : {}),
        ...(useFormData ? {} : { 'Content-Type': 'application/json' }),
      },
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
    const token = (typeof window !== 'undefined') ? localStorage.getItem('authToken') : null;
    return await apiCall(`${endpoints.reviews}${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {}),
      },
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review
  async deleteReview(id) {
    const token = (typeof window !== 'undefined') ? localStorage.getItem('authToken') : null;
    return await apiCall(`${endpoints.reviews}${id}/`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Token ${token}` } : {}),
      },
    });
  },
};

// Skill services
export const skillService = {
  async getAllSkills() {
    return await apiCall(endpoints.skills);
  },
};

// Category services
export const categoryService = {
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