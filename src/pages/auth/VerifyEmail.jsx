import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiMail } from 'react-icons/fi';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { authAPI } from '../../api/auth.api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Verification token is missing');
    }
  }, [token]);

  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { state: { verified: true } });
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.message ||
        'Failed to verify email. The link may be expired.'
      );
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await authAPI.resendVerification();
      setMessage('Verification email sent! Please check your inbox.');
      setStatus('success');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Failed to resend verification email'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Verifying your email address"
    >
      <Card className="p-8">
        <div className="text-center">
          {status === 'verifying' && (
            <div className="space-y-4">
              <Spinner size="lg" className="mx-auto" />
              <h3 className="text-lg font-medium text-gray-900">
                Verifying your email...
              </h3>
              <p className="text-sm text-gray-600">
                Please wait while we verify your email address
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Email Verified!
              </h3>
              <p className="text-sm text-gray-600">{message}</p>
              <p className="text-xs text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                <FiXCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Verification Failed
              </h3>
              <p className="text-sm text-gray-600">{message}</p>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full"
                  leftIcon={<FiMail />}
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </AuthLayout>
  );
}
