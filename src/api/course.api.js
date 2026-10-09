import apiClient from './axios.config';

export const courseAPI = {
  // Get all courses with filters
  getCourses: (params) => apiClient.get('/courses', { params }),

  // Get course by ID
  getCourseById: (courseId) => apiClient.get(`/courses/${courseId}`),

  // Get course details with modules and lessons
  getCourseDetails: (courseId) => apiClient.get(`/courses/${courseId}/details`),

  // Get course categories
  getCategories: () => apiClient.get('/courses/categories'),

  // Create course (instructor/admin)
  createCourse: (data) => apiClient.post('/courses', data),

  // Update course
  updateCourse: (courseId, data) => apiClient.patch(`/courses/${courseId}`, data),

  // Delete course
  deleteCourse: (courseId) => apiClient.delete(`/courses/${courseId}`),

  // Upload course thumbnail
  uploadThumbnail: (file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    return apiClient.post('/courses/upload-thumbnail', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get my courses (instructor)
  getMyCourses: () => apiClient.get('/courses/my-courses'),

  // Get course statistics
  getCourseStats: (courseId) => apiClient.get(`/courses/${courseId}/stats`),

  // Module operations
  createModule: (courseId, data) => apiClient.post(`/courses/${courseId}/modules`, data),
  updateModule: (moduleId, data) => apiClient.put(`/courses/modules/${moduleId}`, data),
  deleteModule: (moduleId) => apiClient.delete(`/courses/modules/${moduleId}`),

  // Lesson operations
  createLesson: (moduleId, data) => apiClient.post(`/courses/modules/${moduleId}/lessons`, data),
  updateLesson: (lessonId, data) => apiClient.put(`/courses/lessons/${lessonId}`, data),
  deleteLesson: (lessonId) => apiClient.delete(`/courses/lessons/${lessonId}`),

  // Upload lesson video
  uploadLessonVideo: (lessonId, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('video', file);
    return apiClient.post(`/lessons/${lessonId}/video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
};
