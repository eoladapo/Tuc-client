import apiClient from './axios.config';

export const analyticsAPI = {
  // Get instructor analytics
  getInstructorAnalytics: () => 
    apiClient.get('/analytics/instructor'),
  
  // Get admin analytics
  getAdminAnalytics: () => 
    apiClient.get('/analytics/admin'),
  
  // Get instructor's students
  getInstructorStudents: () => 
    apiClient.get('/analytics/students'),
};
