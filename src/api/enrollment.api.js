import apiClient from './axios.config';

export const enrollmentAPI = {
  // Enroll in a course
  enrollCourse: (courseId, paymentData = {}) =>
    apiClient.post('/enrollments', {
      courseId,
      ...(paymentData.paymentId && { paymentId: paymentData.paymentId })
    }),

  // Get my enrolled courses
  getMyEnrollments: (params) =>
    apiClient.get('/enrollments/my-courses', { params }),

  // Get enrollment by ID
  getEnrollmentById: (enrollmentId) =>
    apiClient.get(`/enrollments/${enrollmentId}`),

  // Check if enrolled in course
  checkEnrollment: (courseId) =>
    apiClient.get(`/enrollments/check/${courseId}`),

  // Get course progress
  getCourseProgress: (courseId) =>
    apiClient.get(`/enrollments/${courseId}/progress`),

  // Update lesson progress
  updateLessonProgress: (lessonId, progressData) =>
    apiClient.put(`/progress/lessons/${lessonId}`, progressData),

  // Mark lesson as complete
  markLessonComplete: (lessonId) =>
    apiClient.post(`/progress/lessons/${lessonId}/complete`),

  // Get certificate
  getCertificate: (enrollmentId) =>
    apiClient.get(`/enrollments/${enrollmentId}/certificate`),

  // Get course enrollments (instructor/admin)
  getCourseEnrollments: (courseId, params) =>
    apiClient.get(`/enrollments/course/${courseId}`, { params }),
};
