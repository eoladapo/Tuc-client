import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentAPI } from '../api/enrollment.api';
import toast from 'react-hot-toast';

// Query keys
export const enrollmentKeys = {
  all: ['enrollments'],
  myEnrollments: ['enrollments', 'my-enrollments'],
  enrollment: (id) => ['enrollments', id],
  check: (courseId) => ['enrollments', 'check', courseId],
  progress: (courseId) => ['enrollments', 'progress', courseId],
  certificate: (id) => ['enrollments', id, 'certificate'],
  courseEnrollments: (courseId) => ['enrollments', 'course', courseId],
};

// Get my enrolled courses
export const useMyEnrollments = (filters = {}) => {
  return useQuery({
    queryKey: [...enrollmentKeys.myEnrollments, filters],
    queryFn: () => enrollmentAPI.getMyEnrollments(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get enrollment by ID
export const useEnrollment = (enrollmentId) => {
  return useQuery({
    queryKey: enrollmentKeys.enrollment(enrollmentId),
    queryFn: () => enrollmentAPI.getEnrollmentById(enrollmentId),
    enabled: !!enrollmentId,
  });
};

// Check if enrolled in course
export const useCheckEnrollment = (courseId) => {
  return useQuery({
    queryKey: enrollmentKeys.check(courseId),
    queryFn: () => enrollmentAPI.checkEnrollment(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
  });
};

// Get course progress
export const useCourseProgress = (courseId) => {
  return useQuery({
    queryKey: enrollmentKeys.progress(courseId),
    queryFn: () => enrollmentAPI.getCourseProgress(courseId),
    enabled: !!courseId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get certificate
export const useCertificate = (enrollmentId) => {
  return useQuery({
    queryKey: enrollmentKeys.certificate(enrollmentId),
    queryFn: () => enrollmentAPI.getCertificate(enrollmentId),
    enabled: !!enrollmentId,
  });
};

// Get course enrollments (instructor/admin)
export const useCourseEnrollments = (courseId, filters = {}) => {
  return useQuery({
    queryKey: [...enrollmentKeys.courseEnrollments(courseId), filters],
    queryFn: () => enrollmentAPI.getCourseEnrollments(courseId, filters),
    enabled: !!courseId,
  });
};

// Enroll in course mutation
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, paymentData }) =>
      enrollmentAPI.enrollCourse(courseId, paymentData),
    onSuccess: () => {
      // Invalidate enrollment queries
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.myEnrollments });
      // Invalidate courses queries to update isEnrolled status
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Successfully enrolled in course!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    },
  });
};

// Update lesson progress mutation
export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, progressData }) =>
      enrollmentAPI.updateLessonProgress(lessonId, progressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update progress');
    },
  });
};

// Mark lesson as complete mutation
export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId) => enrollmentAPI.markLessonComplete(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
      toast.success('Lesson marked as complete!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to mark lesson complete');
    },
  });
};
