import apiClient from './axios.config';

export const authAPI = {
  // Register new user
  register: (data) => apiClient.post('/auth/register', data),

  // Login user
  login: (data) => apiClient.post('/auth/login', data),

  // Logout user
  logout: () => apiClient.post('/auth/logout'),

  // Get current user
  getCurrentUser: () => apiClient.get('/auth/me'),

  // Forgot password
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),

  // Reset password
  resetPassword: (token, password) =>
    apiClient.post('/auth/reset-password', { token, password }),

  // Verify email
  verifyEmail: (token) => apiClient.post('/auth/verify-email', { token }),

  // Resend verification email
  resendVerification: () => apiClient.post('/auth/resend-verification'),

  // Update user profile
  updateProfile: (data) => apiClient.patch('/auth/update-profile', data),
};
