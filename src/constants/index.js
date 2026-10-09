// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
};

// Course Levels
export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// Lesson Types
export const LESSON_TYPES = {
  VIDEO: 'video',
  TEXT: 'text',
  QUIZ: 'quiz',
};

// Enrollment Status
export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  SUSPENDED: 'suspended',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  COURSE: 'course',
  PAYMENT: 'payment',
  ACHIEVEMENT: 'achievement',
};

// Quiz Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
};

// Reward Types
export const REWARD_TYPES = {
  BADGE: 'badge',
  ACHIEVEMENT: 'achievement',
  MILESTONE: 'milestone',
};

// Activity Types
export const ACTIVITY_TYPES = {
  LESSON_COMPLETE: 'lesson_complete',
  COURSE_COMPLETE: 'course_complete',
  QUIZ_PASS: 'quiz_pass',
  DAILY_LOGIN: 'daily_login',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // Courses
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  COURSE_PLAYER: '/courses/:id/learn',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  MY_COURSES: '/dashboard/my-courses',
  MY_PROGRESS: '/dashboard/progress',
  MY_CERTIFICATES: '/dashboard/certificates',
  MY_REWARDS: '/dashboard/rewards',
  SETTINGS: '/dashboard/settings',
  
  // Instructor
  INSTRUCTOR_DASHBOARD: '/instructor',
  INSTRUCTOR_COURSES: '/instructor/courses',
  CREATE_COURSE: '/instructor/courses/create',
  EDIT_COURSE: '/instructor/courses/:id/edit',
  INSTRUCTOR_ANALYTICS: '/instructor/analytics',
  INSTRUCTOR_EARNINGS: '/instructor/earnings',
  
  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_REWARDS: '/admin/rewards',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'tuc_lms_token',
  USER: 'tuc_lms_user',
  THEME: 'tuc_lms_theme',
};

// Query Keys for React Query
export const QUERY_KEYS = {
  USER: 'user',
  COURSES: 'courses',
  COURSE: 'course',
  ENROLLMENTS: 'enrollments',
  ENROLLMENT: 'enrollment',
  PROGRESS: 'progress',
  QUIZZES: 'quizzes',
  QUIZ: 'quiz',
  REVIEWS: 'reviews',
  CERTIFICATES: 'certificates',
  NOTIFICATIONS: 'notifications',
  REWARDS: 'rewards',
  PAYMENTS: 'payments',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

// Validation
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_BIO_LENGTH = 500;
export const MAX_COURSE_TITLE_LENGTH = 100;
export const MAX_LESSON_TITLE_LENGTH = 150;
