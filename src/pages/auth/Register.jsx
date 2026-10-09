import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { HiEye, HiEyeSlash, HiSparkles, HiLightBulb, HiUsers } from 'react-icons/hi2';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';
import { authAPI } from '../../api/auth.api';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Remove confirmPassword and acceptTerms before sending
      const { confirmPassword, acceptTerms, fullName, ...rest } = data;

      // Split full name into first and last name
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      // All new users are students by default
      const payload = {
        ...rest,
        firstName,
        lastName,
        role: 'student',
      };

      await authAPI.register(payload);
      toast.success('Account created! Please check your email to verify your account.');
      navigate('/login', { state: { registered: true } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Brand Message */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-accent-100/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Logo size="default" />
        </div>

        <div className="relative z-10 space-y-10">
          {/* Main Content */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/50">
              <HiSparkles className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-medium text-slate-700">Upskill & Grow</span>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">
              Build Your Brand
              <br />
              <span className="text-primary-600">With Confidence</span>
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-md">
              Learn proven marketing strategies, social media management, and brand building skills from industry experts.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-3.5 p-3.5 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiLightBulb className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">For Founders</h3>
                <p className="text-xs text-slate-600">Build visibility from day one</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiUsers className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">For Marketers</h3>
                <p className="text-xs text-slate-600">Master social media & growth tools</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          &copy; 2026 TUC Academy
        </p>
      </div>

      {/* Right Column - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <Logo size="small" />
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create account</h2>
            <p className="mt-2.5 text-sm text-slate-600">
              Already a member?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold underline decoration-2 underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              variant="minimal"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

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
                placeholder="At least 6 characters"
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

            <div className="relative">
              <Input
                variant="minimal"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 bottom-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <HiEyeSlash className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 text-primary-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 transition-colors"
                  {...register('acceptTerms')}
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold underline decoration-1 underline-offset-2">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold underline decoration-1 underline-offset-2">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1.5 text-xs text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-7"
              size="lg"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          {/* Mobile Footer */}
          <p className="lg:hidden mt-10 text-center text-xs text-slate-500">
            &copy; 2026 TUC Academy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
