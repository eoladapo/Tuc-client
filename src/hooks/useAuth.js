import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Query keys
export const authKeys = {
  profile: ['auth', 'profile'],
};

// Get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: authAPI.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Login mutation
export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

// Register mutation
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // Clear all cached queries
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      // Still logout on error
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => authAPI.forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset link sent to your email');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, password }) => authAPI.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Password reset successful! Please login with your new password.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    },
  });
};

// Verify email mutation
export const useVerifyEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (token) => authAPI.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified successfully! You can now login.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Email verification failed');
    },
  });
};

// Resend verification mutation
export const useResendVerification = () => {
  return useMutation({
    mutationFn: authAPI.resendVerification,
    onSuccess: () => {
      toast.success('Verification email sent! Please check your inbox.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    },
  });
};
