import apiClient from './axios.config';

export const progressAPI = {
  // Mark lesson progress (use progressPercentage: 100 for complete)
  markLessonProgress: (data) => apiClient.post('/progress/lesson', data),

  // Mark lesson as complete (convenience method)
  markLessonComplete: (lessonId) =>
    apiClient.post('/progress/lesson', {
      lessonId,
      progressPercentage: 100
    }),

  // Get user's progress for a course
  getCourseProgress: (courseId) => apiClient.get(`/progress/course/${courseId}`),

  // Get progress for a specific lesson
  getLessonProgress: (lessonId) => apiClient.get(`/progress/lesson/${lessonId}`),

  // Get all user progress
  getMyProgress: () => apiClient.get('/progress/user/me'),

  // Get course stats
  getCourseStats: (courseId) => apiClient.get(`/progress/stats/course/${courseId}`),
};
