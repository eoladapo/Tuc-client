import api from './api';

export const reviewService = {
  // Create review
  createReview: async (courseId, reviewData) => {
    const response = await api.post(`/reviews/courses/${courseId}`, reviewData);
    return response.data;
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Get course reviews
  getCourseReviews: async (courseId, params = {}) => {
    const response = await api.get(`/reviews/courses/${courseId}`, { params });
    return response.data;
  },

  // Get my reviews
  getMyReviews: async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },
};
