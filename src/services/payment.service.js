import api from './api';

export const paymentService = {
  // Initialize payment
  initializePayment: async (paymentData) => {
    const response = await api.post('/payments/initialize', paymentData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (reference) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (params = {}) => {
    const response = await api.get('/payments/my-payments', { params });
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Get all payments (admin)
  getAllPayments: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Get payment statistics (admin)
  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },
};
