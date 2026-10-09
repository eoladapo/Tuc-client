import api from './api';

export const courseService = {
  // Get all courses with filters
  getCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  // Get course with full details (modules, lessons)
  getCourseDetails: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/details`);
    return response.data;
  },

  // Create new course (instructor/admin)
  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },

  // Upload course thumbnail
  uploadThumbnail: async (courseId, file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    const response = await api.post(`/courses/${courseId}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get course categories
  getCategories: async () => {
    const response = await api.get('/courses/categories');
    return response.data;
  },

  // Create module
  createModule: async (courseId, moduleData) => {
    const response = await api.post(`/courses/${courseId}/modules`, moduleData);
    return response.data;
  },

  // Update module
  updateModule: async (moduleId, moduleData) => {
    const response = await api.put(`/modules/${moduleId}`, moduleData);
    return response.data;
  },

  // Delete module
  deleteModule: async (moduleId) => {
    const response = await api.delete(`/modules/${moduleId}`);
    return response.data;
  },

  // Create lesson
  createLesson: async (moduleId, lessonData) => {
    const response = await api.post(`/modules/${moduleId}/lessons`, lessonData);
    return response.data;
  },

  // Update lesson
  updateLesson: async (lessonId, lessonData) => {
    const response = await api.put(`/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  // Delete lesson
  deleteLesson: async (lessonId) => {
    const response = await api.delete(`/lessons/${lessonId}`);
    return response.data;
  },

  // Upload lesson video
  uploadLessonVideo: async (lessonId, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('video', file);
    const response = await api.post(`/lessons/${lessonId}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  // Get my courses (instructor)
  getMyCourses: async () => {
    const response = await api.get('/courses/my-courses');
    return response.data;
  },

  // Get course statistics (instructor/admin)
  getCourseStats: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/stats`);
    return response.data;
  },
};
