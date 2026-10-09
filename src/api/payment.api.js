import apiClient from './axios.config';

export const paymentAPI = {
  // Initiate payment for a course
  initiatePayment: (courseId, callbackUrl) => 
    apiClient.post('/payments/initiate', { courseId, callbackUrl }),
  
  // Verify payment by reference
  verifyPayment: (reference) => 
    apiClient.get(`/payments/verify/${reference}`),
  
  // Get user's payment history
  getUserPayments: () => 
    apiClient.get('/payments/user/me'),
  
  // Get payment by reference
  getPaymentByReference: (reference) => 
    apiClient.get(`/payments/reference/${reference}`),
  
  // Get payment by ID
  getPaymentById: (paymentId) => 
    apiClient.get(`/payments/${paymentId}`),
};
