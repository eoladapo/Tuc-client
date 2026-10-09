import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../api/analytics.api';

// Query keys
export const analyticsKeys = {
  instructor: ['analytics', 'instructor'],
  admin: ['analytics', 'admin'],
  students: ['analytics', 'students'],
};

// Get instructor analytics
export const useInstructorAnalytics = (shouldSkip = false) => {
  return useQuery({
    queryKey: analyticsKeys.instructor,
    queryFn: () => analyticsAPI.getInstructorAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !shouldSkip,
  });
};

// Get admin analytics
export const useAdminAnalytics = (shouldSkip = false) => {
  return useQuery({
    queryKey: analyticsKeys.admin,
    queryFn: () => analyticsAPI.getAdminAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !shouldSkip,
  });
};

// Get instructor's students
export const useInstructorStudents = () => {
  return useQuery({
    queryKey: analyticsKeys.students,
    queryFn: () => analyticsAPI.getInstructorStudents(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
