import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useVerifyPayment } from '../hooks/usePayments';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | failed

  const { mutate: verifyPayment, isPending } = useVerifyPayment();

  useEffect(() => {
    const reference = searchParams.get('reference');
    const paystackStatus = searchParams.get('trxref'); // Paystack redirects with trxref

    if (!reference && !paystackStatus) {
      setStatus('failed');
      return;
    }

    const paymentReference = reference || paystackStatus;

    // Verify the payment
    verifyPayment(paymentReference, {
      onSuccess: (response) => {
        // Handle different response structures
        const payment = response?.data?.data || response?.data || response;

        if (payment.status === 'success') {
          setStatus('success');
          // Redirect to browse courses after 2 seconds (safer than trying to get course ID)
          setTimeout(() => {
            navigate('/dashboard/browse');
          }, 2000);
        } else {
          setStatus('failed');
        }
      },
      onError: (error) => {
        setStatus('failed');
      }
    });
  }, [searchParams, verifyPayment, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {status === 'verifying' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <FiLoader className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              You have been successfully enrolled in the course.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your course...
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FiXCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please try again or contact support.
            </p>
            <button
              onClick={() => navigate('/dashboard/browse')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Back to Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
