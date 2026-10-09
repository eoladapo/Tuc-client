import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiEye, HiEyeSlash, HiSparkles, HiChartBar, HiRocketLaunch } from 'react-icons/hi2';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Snackbar } from '../../components/ui';
import Logo from '../../components/ui/Logo';
import { authAPI } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { useSnackbar } from '../../hooks';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);

      // Set auth state
      setAuth(response.data.user, response.data.token);

      // Small delay to ensure Zustand persist saves to localStorage
      await new Promise(resolve => setTimeout(resolve, 100));

      showSnackbar('Welcome back!', 'success');

      // Navigate after showing success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      // Show "Invalid email or password" for authentication errors
      const errorMessage = error.response?.status === 401 || error.response?.status === 400
        ? 'Invalid email or password'
        : error.response?.data?.message || 'Login failed';

      showSnackbar(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
      />

      <div className="min-h-screen flex bg-white">
        {/* Left Column - Brand Message */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-20 w-80 h-80 bg-primary-100/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <Logo size="default" />
          </div>

          <div className="relative z-10 space-y-10">
            {/* Main Content */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/50">
                <HiSparkles className="w-4 h-4 text-accent-500" />
                <span className="text-xs font-medium text-slate-700">For Founders & Brands</span>
              </div>

              <h1 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                Amplify Your
                <br />
                <span className="text-primary-600">Brand Visibility</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-md">
                Master marketing strategies and social media tools that help founders and brands get noticed and grow.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3 max-w-md">
              <div className="flex items-center gap-3.5 p-3.5 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HiChartBar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Marketing Mastery</h3>
                  <p className="text-xs text-slate-600">Digital marketing & brand growth</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HiRocketLaunch className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Social Media Tools</h3>
                  <p className="text-xs text-slate-600">Master platforms that drive visibility</p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-500">
            &copy; 2026 TUC Academy
          </p>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-10">
              <Logo size="small" />
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sign in</h2>
              <p className="mt-2.5 text-sm text-slate-600">
                New here?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold underline decoration-2 underline-offset-4">
                  Create an account
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              <Input
                variant="minimal"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="relative">
                <Input
                  variant="minimal"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <HiEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 transition-colors"
                  />
                  <span className="text-slate-600 group-hover:text-slate-900 text-sm">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full mt-8"
                size="lg"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Mobile Footer */}
            <p className="lg:hidden mt-10 text-center text-xs text-slate-500">
              &copy; 2026 TUC Academy
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
