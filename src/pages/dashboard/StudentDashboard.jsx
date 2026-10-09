import { HiAcademicCap, HiTrendingUp, HiClock, HiCheckCircle, HiPlay, HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useMyEnrollments } from '../../hooks/useEnrollments';
import Skeleton from '../../components/ui/Skeleton';

const StatCard = ({ title, value, icon: Icon, subtitle, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { data: enrollmentsData, isLoading } = useMyEnrollments();
  const enrollments = enrollmentsData?.data?.enrollments || [];

  // Calculate stats
  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter(e => e.completedAt).length;
  const inProgressCourses = enrollments.filter(e => !e.completedAt);

  // Get recent courses (last 3)
  const recentCourses = enrollments.slice(0, 3);

  const gradients = {
    'gradient-1': 'from-blue-500 to-purple-600',
    'gradient-2': 'from-green-500 to-teal-600',
    'gradient-3': 'from-orange-500 to-red-600',
  };

  const getGradient = (index) => {
    const gradientKeys = Object.keys(gradients);
    const key = gradientKeys[index % gradientKeys.length];
    return gradients[key];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back!</h1>
        <p className="text-slate-600 mt-1">Continue building your brand and marketing skills.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Courses"
          value={totalEnrolled}
          icon={HiAcademicCap}
          subtitle={totalEnrolled === 0 ? "Start learning today" : `${inProgressCourses.length} in progress`}
          color="primary"
        />
        <StatCard
          title="Completed"
          value={completedCourses}
          icon={HiCheckCircle}
          subtitle={completedCourses === 0 ? "No certificates yet" : `${completedCourses} certificate${completedCourses !== 1 ? 's' : ''}`}
          color="green"
        />
        <StatCard
          title="Learning Streak"
          value="0 days"
          icon={HiTrendingUp}
          subtitle="Keep learning daily"
          color="accent"
        />
        <StatCard
          title="Hours Learned"
          value="0h"
          icon={HiClock}
          subtitle="This month"
          color="purple"
        />
      </div>

      {/* Continue Learning Section */}
      {recentCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Continue Learning</h2>
            <Link
              to="/dashboard/my-learning"
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl">
            {recentCourses.map((enrollment, index) => {
              const course = enrollment.course;
              const progress = enrollment.progressPercentage || 0;

              return (
                <div key={enrollment.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all hover:shadow-md group max-w-xs">
                  {/* Thumbnail */}
                  <div className={`relative h-32 bg-gradient-to-br ${getGradient(index)}`}>
                    {enrollment.completedAt && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-semibold rounded-full">
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2 leading-tight">
                      {course?.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      by {course?.instructor?.firstName} {course?.instructor?.lastName}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-600">Progress</span>
                        <span className="text-[10px] font-medium text-primary-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-primary-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/dashboard/courses/${course?.id}/learn`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium text-xs"
                    >
                      <HiPlay className="w-3 h-3" />
                      {enrollment.completedAt ? 'Review' : 'Continue'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State or Browse CTA */}
      {totalEnrolled === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiAcademicCap className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Enrolled Courses Yet</h3>
            <p className="text-slate-600 mb-6">
              Discover courses that will help you master marketing and branding skills.
            </p>
            <Link
              to="/dashboard/browse"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">Discover More Courses</h2>
            <p className="text-white/90 mb-6">
              Continue expanding your skills with more courses in marketing, branding, and social media.
            </p>
            <Link
              to="/dashboard/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <HiAcademicCap className="w-5 h-5" />
              Browse More Courses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
