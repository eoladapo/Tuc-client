import api from './api';

export const quizService = {
  // Get quiz by lesson ID
  getQuizByLesson: async (lessonId) => {
    const response = await api.get(`/quizzes/lesson/${lessonId}`);
    return response.data;
  },

  // Submit quiz attempt
  submitQuiz: async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },

  // Get quiz attempts
  getQuizAttempts: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/attempts`);
    return response.data;
  },

  // Get quiz results
  getQuizResults: async (attemptId) => {
    const response = await api.get(`/quizzes/attempts/${attemptId}/results`);
    return response.data;
  },

  // Create quiz (instructor)
  createQuiz: async (lessonId, quizData) => {
    const response = await api.post(`/quizzes/lesson/${lessonId}`, quizData);
    return response.data;
  },

  // Update quiz (instructor)
  updateQuiz: async (quizId, quizData) => {
    const response = await api.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  },

  // Delete quiz (instructor)
  deleteQuiz: async (quizId) => {
    const response = await api.delete(`/quizzes/${quizId}`);
    return response.data;
  },
};
