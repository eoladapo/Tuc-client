import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseAPI } from '../api/course.api';
import toast from 'react-hot-toast';

// Query keys
export const courseKeys = {
  all: ['courses'],
  lists: () => [...courseKeys.all, 'list'],
  list: (filters) => [...courseKeys.lists(), { filters }],
  details: () => [...courseKeys.all, 'detail'],
  detail: (id) => [...courseKeys.details(), id],
  categories: ['courses', 'categories'],
  myCourses: ['courses', 'my-courses'],
  stats: (id) => ['courses', id, 'stats'],
};

// Get all courses
export const useCourses = (filters = {}) => {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => courseAPI.getCourses(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get course by ID
export const useCourse = (courseId) => {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => courseAPI.getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get course details (with modules and lessons)
export const useCourseDetails = (courseId) => {
  return useQuery({
    queryKey: [...courseKeys.detail(courseId), 'full'],
    queryFn: () => courseAPI.getCourseDetails(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get course categories
export const useCategories = () => {
  return useQuery({
    queryKey: courseKeys.categories,
    queryFn: courseAPI.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
  });
};

// Get instructor's courses
export const useMyCourses = () => {
  return useQuery({
    queryKey: courseKeys.myCourses,
    queryFn: courseAPI.getMyCourses,
    staleTime: 2 * 60 * 1000,
  });
};

// Get course statistics
export const useCourseStats = (courseId) => {
  return useQuery({
    queryKey: courseKeys.stats(courseId),
    queryFn: () => courseAPI.getCourseStats(courseId),
    enabled: !!courseId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Create course mutation
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseAPI.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.myCourses });
      toast.success('Course created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create course');
    },
  });
};

// Update course mutation
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }) => courseAPI.updateCourse(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success('Course updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update course');
    },
  });
};

// Delete course mutation
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseAPI.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Course deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    },
  });
};

// Upload thumbnail mutation
export const useUploadThumbnail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, file }) => courseAPI.uploadThumbnail(courseId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.courseId) });
      toast.success('Thumbnail uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload thumbnail');
    },
  });
};

// Create module mutation
export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }) => courseAPI.createModule(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.courseId) });
      toast.success('Module created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create module');
    },
  });
};

// Update module mutation
export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }) => courseAPI.updateModule(moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Module updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update module');
    },
  });
};

// Delete module mutation
export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseAPI.deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Module deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete module');
    },
  });
};

// Create lesson mutation
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }) => courseAPI.createLesson(moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Lesson created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create lesson');
    },
  });
};

// Update lesson mutation
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, data }) => courseAPI.updateLesson(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Lesson updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update lesson');
    },
  });
};

// Delete lesson mutation
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseAPI.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Lesson deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete lesson');
    },
  });
};

// Upload lesson video mutation
export const useUploadLessonVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, file, onUploadProgress }) => 
      courseAPI.uploadLessonVideo(lessonId, file, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Video uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload video');
    },
  });
};
