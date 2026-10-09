import { HiAcademicCap, HiUsers, HiCurrencyDollar, HiStar, HiPlus, HiCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { SkeletonCard, SkeletonTable } from '../../components/ui/Skeleton';
import { useInstructorAnalytics } from '../../hooks/useAnalytics';
import { useMyCourses } from '../../hooks/useCourses';
import { formatDistanceToNow } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StatCard = ({ title, value, icon: Icon, subtitle, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const InstructorDashboard = () => {
  const { data: analyticsData, isLoading: analyticsLoading } = useInstructorAnalytics();
  const { data: coursesData, isLoading: coursesLoading } = useMyCourses();

  const analytics = analyticsData?.data;
  const courses = coursesData?.data?.courses || [];

  const isLoading = analyticsLoading || coursesLoading;

  // Calculate stats
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.status === 'published').length;
  const draftCourses = courses.filter(c => c.status === 'draft').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-72 bg-slate-200 rounded animate-pulse" />
            <div className="h-5 w-96 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonTable rows={4} />
          <SkeletonTable rows={4} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="h-64 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Instructor Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your courses and track student progress.</p>
        </div>
        <Link
          to="/dashboard/courses/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          <HiPlus className="w-5 h-5" />
          Create Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Courses"
          value={totalCourses.toString()}
          icon={HiAcademicCap}
          subtitle={`${publishedCourses} published, ${draftCourses} draft`}
          color="primary"
        />
        <StatCard
          title="Total Students"
          value={analytics?.overview?.totalStudents?.toLocaleString() || '0'}
          icon={HiUsers}
          subtitle="Across all courses"
          color="accent"
        />
        <StatCard
          title="Earnings"
          value={`₦${Number(analytics?.overview?.revenue || 0).toLocaleString()}`}
          icon={HiCurrencyDollar}
          subtitle="Total revenue"
          color="green"
        />
        <StatCard
          title="Avg. Rating"
          value={analytics?.overview?.avgRating != null ? Number(analytics.overview.avgRating).toFixed(1) : '0.0'}
          icon={HiStar}
          subtitle={`${analytics?.overview?.completionRate != null ? Number(analytics.overview.completionRate).toFixed(0) : '0'}% completion rate`}
          color="purple"
        />
      </div>

      {/* My Courses & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">My Courses</h2>
            <Link to="/dashboard/my-courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.slice(0, 4).map((course) => (
                <div key={course.id} className="p-4 rounded-lg border border-slate-200 hover:border-primary-200 hover:bg-primary-50/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{course.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {course.enrolledCount || 0} students enrolled
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${course.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HiAcademicCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No courses yet</p>
              <Link
                to="/dashboard/courses/create"
                className="inline-block mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Create your first course
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  {activity.type === 'completion' && (
                    <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <HiCheckCircle className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Course Performance</h2>
        {analytics?.performanceData && analytics.performanceData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  style={{ fontSize: '14px' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '14px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Enrollments"
                />
                <Line
                  type="monotone"
                  dataKey="completions"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Completions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <HiAcademicCap className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No performance data available yet</p>
              <p className="text-sm text-slate-400 mt-1">Data will appear once you have enrollments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
