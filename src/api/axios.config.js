import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;

      // Unauthorized - clear token and redirect to login
      // But only if not already on login/register pages
      if (status === 401) {
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath === '/login' ||
          currentPath === '/register' ||
          currentPath.startsWith('/forgot-password') ||
          currentPath.startsWith('/reset-password');

        if (!isAuthPage) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
