import { apiCall, endpoints } from '../utils/api';

const skillService = {
  // Get all skills
  async getAllSkills() {
    return await apiCall(endpoints.skills);
  },
};

export default skillService; 