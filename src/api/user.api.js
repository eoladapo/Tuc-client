import apiClient from './axios.config';

export const userAPI = {
  // Get all users (admin)
  getUsers: (params) => apiClient.get('/users', { params }),
  
  // Get user by ID
  getUserById: (userId) => apiClient.get(`/users/${userId}`),
  
  // Update user (admin)
  updateUser: (userId, data) => apiClient.put(`/users/${userId}`, data),
  
  // Delete user (admin)
  deleteUser: (userId) => apiClient.delete(`/users/${userId}`),
  
  // Toggle user status (admin)
  toggleUserStatus: (userId) => apiClient.put(`/users/${userId}/toggle-status`),
  
  // Get user statistics
  getUserStats: () => apiClient.get('/users/stats'),
  
  // Get my students (instructor)
  getMyStudents: (params) => apiClient.get('/users/my-students', { params }),
};
