import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Public marketing site — eager on purpose. It is the entry route, so lazy
// loading it would only add a round trip to first paint.
import LandingPage from '../pages/landing/LandingPage';

// Everything below is code-split. The dashboard alone pulls in recharts and
// react-player; without this the landing page ships those to every visitor.
// Each module must keep its default export — React.lazy requires one.
const StyleGuidePage = lazy(() => import('../pages/StyleGuidePage'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));
const PaymentCallback = lazy(() => import('../pages/PaymentCallback'));

// Dashboard Layout
const DashboardLayout = lazy(() => import('../components/layout/DashboardLayout'));

// Dashboard Pages
const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboard'));
const InstructorDashboard = lazy(() => import('../pages/dashboard/InstructorDashboard'));
const StudentDashboard = lazy(() => import('../pages/dashboard/StudentDashboardAlt')); // Testing new dashboard
const UsersPage = lazy(() => import('../pages/dashboard/UsersPage'));
const SettingsPage = lazy(() => import('../pages/dashboard/SettingsPage'));
const AnalyticsPage = lazy(() => import('../pages/dashboard/AnalyticsPage'));
const BrowseCoursesPage = lazy(() => import('../pages/dashboard/BrowseCoursesPage'));
const MyLearningPage = lazy(() => import('../pages/dashboard/MyLearningPage'));
const CoursePlayerPage = lazy(() => import('../pages/dashboard/CoursePlayerPageAlt')); // Testing new player layout
const CreateCoursePage = lazy(() => import('../pages/dashboard/CreateCoursePage'));
const MyCoursesPage = lazy(() => import('../pages/dashboard/MyCoursesPage'));
const EditCoursePage = lazy(() => import('../pages/dashboard/EditCoursePage'));
const CoursePreviewPage = lazy(() => import('../pages/dashboard/CoursePreviewPage'));
const StudentsPage = lazy(() => import('../pages/dashboard/StudentsPage'));
const NotificationsPage = lazy(() => import('../pages/dashboard/NotificationsPage'));

// Role-based Dashboard Wrapper
const RoleBasedDashboard = () => {
  const { user } = useAuthStore();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'instructor') {
    return <InstructorDashboard />;
  }

  return <StudentDashboard />;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Router Configuration
export const router = createBrowserRouter([
  {
    // Public marketing landing page. Signed-in users still reach the
    // dashboard via /dashboard and the nav "Sign in" / "Start free" CTAs.
    path: '/',
    element: <LandingPage />,
  },
  {
    // Living style guide — the brand system in code.
    path: '/style-guide',
    element: <StyleGuidePage />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
    path: '/payment/callback',
    element: (
      <ProtectedRoute>
        <PaymentCallback />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <RoleBasedDashboard />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/users',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <UsersPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/courses',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <MyCoursesPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/my-courses',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <MyCoursesPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/settings',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <SettingsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/students',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <StudentsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/analytics',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AnalyticsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/browse',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <BrowseCoursesPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/my-learning',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <MyLearningPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/courses/:courseId/learn',
    element: (
      <ProtectedRoute>
        <CoursePlayerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/courses/create',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <CreateCoursePage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/my-courses',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <MyCoursesPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/courses/:courseId/edit',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <EditCoursePage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/courses/:courseId/preview',
    element: (
      <ProtectedRoute>
        <CoursePreviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/notifications',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <NotificationsPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-700 mb-4">404</h1>
          <p className="text-gray-600 mb-4">Page not found</p>
          <a
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Go back home
          </a>
        </div>
      </div>
    ),
  },
]);
