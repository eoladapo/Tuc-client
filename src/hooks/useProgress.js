import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressAPI } from '../api/progress.api';
import toast from 'react-hot-toast';

// Query keys
export const progressKeys = {
  all: ['progress'],
  lists: () => [...progressKeys.all, 'list'],
  list: (filters) => [...progressKeys.lists(), { filters }],
  details: () => [...progressKeys.all, 'detail'],
  detail: (id) => [...progressKeys.details(), id],
  course: (courseId) => [...progressKeys.all, 'course', courseId],
  lesson: (lessonId) => [...progressKeys.all, 'lesson', lessonId],
  my: ['progress', 'my'],
};

// Get course progress
export const useCourseProgress = (courseId) => {
  return useQuery({
    queryKey: progressKeys.course(courseId),
    queryFn: () => progressAPI.getCourseProgress(courseId),
    enabled: !!courseId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get lesson progress
export const useLessonProgress = (lessonId) => {
  return useQuery({
    queryKey: progressKeys.lesson(lessonId),
    queryFn: () => progressAPI.getLessonProgress(lessonId),
    enabled: !!lessonId,
    staleTime: 30 * 1000,
  });
};

// Get my progress
export const useMyProgress = () => {
  return useQuery({
    queryKey: progressKeys.my,
    queryFn: progressAPI.getMyProgress,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Mark lesson as complete mutation
export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressAPI.markLessonComplete,
    onSuccess: (data, lessonId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: progressKeys.lesson(lessonId) });
      queryClient.invalidateQueries({ queryKey: progressKeys.all });

      toast.success('✅ Lesson completed!', {
        icon: '🎉',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to mark lesson as complete');
    },
  });
};

// Mark lesson progress mutation (for tracking watch time, position, etc.)
export const useMarkLessonProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressAPI.markLessonProgress,
    onSuccess: (data) => {
      // Silently update cache
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
    onError: () => {
      // Silent error - progress tracking shouldn't interrupt user experience
    },
  });
};
