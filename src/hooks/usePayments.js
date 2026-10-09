import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentAPI } from '../api/payment.api';
import toast from 'react-hot-toast';

// Query keys
export const paymentKeys = {
  all: ['payments'],
  userPayments: ['payments', 'user'],
  payment: (id) => ['payments', id],
  reference: (ref) => ['payments', 'reference', ref],
};

// Get user's payment history
export const useUserPayments = () => {
  return useQuery({
    queryKey: paymentKeys.userPayments,
    queryFn: () => paymentAPI.getUserPayments(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get payment by reference
export const usePaymentByReference = (reference) => {
  return useQuery({
    queryKey: paymentKeys.reference(reference),
    queryFn: () => paymentAPI.getPaymentByReference(reference),
    enabled: !!reference,
  });
};

// Get payment by ID
export const usePayment = (paymentId) => {
  return useQuery({
    queryKey: paymentKeys.payment(paymentId),
    queryFn: () => paymentAPI.getPaymentById(paymentId),
    enabled: !!paymentId,
  });
};

// Initiate payment mutation
export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: ({ courseId, callbackUrl }) =>
      paymentAPI.initiatePayment(courseId, callbackUrl),
    onSuccess: (response) => {
      // Axios interceptor already unwrapped response.data, so:
      // response = { success: true, message: "...", data: { authorizationUrl, ... } }
      const authorizationUrl = response?.data?.authorizationUrl;

      if (authorizationUrl) {
        // Redirect to Paystack checkout
        window.location.href = authorizationUrl;
      } else {
        toast.error('Payment initialization failed. Please try again.');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    },
  });
};

// Verify payment mutation
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference) => paymentAPI.verifyPayment(reference),
    onSuccess: () => {
      // Invalidate payment queries
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      // Invalidate enrollment queries
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      // Invalidate courses queries to update isEnrolled status
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Payment verified! You are now enrolled in the course.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Payment verification failed');
    },
  });
};
