import { useState } from 'react';
import { HiUsers, HiAcademicCap, HiCurrencyDollar, HiTrendingUp } from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PageHeader } from '../../components/dashboard';
import { useAuthStore } from '../../store/authStore';
import { useInstructorAnalytics, useAdminAnalytics } from '../../hooks/useAnalytics';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  const { data: instructorData, isLoading: instructorLoading } = useInstructorAnalytics(isAdmin);
  const { data: adminData, isLoading: adminLoading } = useAdminAnalytics(!isAdmin);

  const isLoading = isAdmin ? adminLoading : instructorLoading;
  const analytics = isAdmin
    ? adminData?.data
    : instructorData?.data;

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-96 bg-slate-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="h-5 w-24 bg-slate-200 rounded animate-pulse mb-4" />
              <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-40 bg-slate-200 rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4" />
              <div className="h-64 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description={user?.role === 'admin' ? 'Platform performance and insights' : 'Your performance insights'}
        action={
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="12months">Last 12 months</option>
          </select>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === 'admin' ? (
          <>
            <StatCard
              title="Total Revenue"
              value={`₦${Number(analytics?.overview?.revenue || 0).toLocaleString()}`}
              icon={HiCurrencyDollar}
            />
            <StatCard
              title="Total Users"
              value={analytics?.overview?.totalUsers?.toLocaleString() || '0'}
              icon={HiUsers}
            />
            <StatCard
              title="Total Courses"
              value={analytics?.overview?.totalCourses?.toLocaleString() || '0'}
              icon={HiAcademicCap}
            />
            <StatCard
              title="Active Enrollments"
              value={analytics?.overview?.activeEnrollments?.toLocaleString() || '0'}
              icon={HiTrendingUp}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Students"
              value={analytics?.overview?.totalStudents?.toLocaleString() || '0'}
              icon={HiUsers}
            />
            <StatCard
              title="Total Revenue"
              value={`₦${Number(analytics?.overview?.revenue || 0).toLocaleString()}`}
              icon={HiCurrencyDollar}
            />
            <StatCard
              title="Avg. Rating"
              value={analytics?.overview?.avgRating != null ? Number(analytics.overview.avgRating).toFixed(1) : '0.0'}
              icon={HiTrendingUp}
            />
            <StatCard
              title="Completion Rate"
              value={analytics?.overview?.completionRate != null ? `${Number(analytics.overview.completionRate).toFixed(1)}%` : '0%'}
              icon={HiAcademicCap}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue/Performance Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {user?.role === 'admin' ? 'Revenue Trend' : 'Performance Trend'}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                <span className="text-sm text-slate-600">Enrollments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">Completions</span>
              </div>
            </div>
          </div>
          {analytics?.performanceData && analytics.performanceData.length > 0 ? (
            <div className="h-64">
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
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-400">No performance data available yet</p>
            </div>
          )}
        </div>

        {/* User/Student Growth Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {user?.role === 'admin' ? 'User Growth' : 'Student Growth'}
            </h3>
          </div>
          {((user?.role === 'admin' && analytics?.userGrowthData) ||
            (user?.role !== 'admin' && analytics?.studentGrowthData)) &&
            ((user?.role === 'admin' ? analytics.userGrowthData : analytics.studentGrowthData).length > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={user?.role === 'admin' ? analytics.userGrowthData : analytics.studentGrowthData}
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
                    dataKey={user?.role === 'admin' ? 'users' : 'students'}
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name={user?.role === 'admin' ? 'New Users' : 'New Students'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-400">No growth data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          {user?.role === 'admin' ? 'Top Performing Courses' : 'Your Top Courses'}
        </h3>
        {analytics?.topCourses && analytics.topCourses.length > 0 ? (
          <div className="space-y-4">
            {analytics.topCourses.map((course, i) => (
              <div key={course.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-primary-200 hover:bg-primary-50/50 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-slate-300">#{i + 1}</span>
                  <div>
                    <h4 className="font-medium text-slate-900">{course.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {course.enrollmentCount} students
                      {course.avgRating && ` • ★ ${Number(course.avgRating).toFixed(1)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ₦{course.revenue?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-slate-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <HiAcademicCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No course data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
