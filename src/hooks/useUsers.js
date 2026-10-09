import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../api/user.api';
import toast from 'react-hot-toast';

// Query keys
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  detail: (id) => [...userKeys.all, 'detail', id],
  stats: ['users', 'stats'],
  myStudents: ['users', 'my-students'],
};

// Get all users (admin)
export const useUsers = (filters = {}) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => userAPI.getUsers(filters),
    staleTime: 1 * 60 * 1000,
  });
};

// Get user by ID
export const useUser = (userId) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userAPI.getUserById(userId),
    enabled: !!userId,
  });
};

// Get user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats,
    queryFn: userAPI.getUserStats,
    staleTime: 2 * 60 * 1000,
  });
};

// Get instructor's students
export const useMyStudents = (filters = {}) => {
  return useQuery({
    queryKey: [...userKeys.myStudents, filters],
    queryFn: () => userAPI.getMyStudents(filters),
    staleTime: 1 * 60 * 1000,
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }) => userAPI.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
};

// Toggle user status mutation
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User status updated!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    },
  });
};
