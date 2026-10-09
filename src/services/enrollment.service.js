import api from './api';

export const enrollmentService = {
  // Enroll in a course
  enrollCourse: async (courseId, paymentData = {}) => {
    const response = await api.post(`/enrollments/enroll/${courseId}`, paymentData);
    return response.data;
  },

  // Get my enrolled courses
  getMyEnrollments: async (params = {}) => {
    const response = await api.get('/enrollments/my-enrollments', { params });
    return response.data;
  },

  // Get enrollment by ID
  getEnrollmentById: async (enrollmentId) => {
    const response = await api.get(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  // Check if user is enrolled in a course
  checkEnrollment: async (courseId) => {
    const response = await api.get(`/enrollments/check/${courseId}`);
    return response.data;
  },

  // Get course progress
  getCourseProgress: async (courseId) => {
    const response = await api.get(`/enrollments/${courseId}/progress`);
    return response.data;
  },

  // Update lesson progress
  updateLessonProgress: async (lessonId, progressData) => {
    const response = await api.put(`/progress/lessons/${lessonId}`, progressData);
    return response.data;
  },

  // Mark lesson as complete
  markLessonComplete: async (lessonId) => {
    const response = await api.post(`/progress/lessons/${lessonId}/complete`);
    return response.data;
  },

  // Get enrollment certificate
  getCertificate: async (enrollmentId) => {
    const response = await api.get(`/enrollments/${enrollmentId}/certificate`);
    return response.data;
  },

  // Get all enrollments for a course (instructor/admin)
  getCourseEnrollments: async (courseId, params = {}) => {
    const response = await api.get(`/enrollments/course/${courseId}`, { params });
    return response.data;
  },
};
