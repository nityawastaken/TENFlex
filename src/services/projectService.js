import { apiCall, endpoints } from '../utils/api';

const projectService = {
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

  // Get all bids for a project
  async getProjectBids(projectId) {
    return await apiCall(`projects/${projectId}/bids/`);
  },

  // Get all bids by current freelancer
  async getMyBids() {
    return await apiCall('freelancer/your-bids/projects/');
  },
};

export default projectService; 