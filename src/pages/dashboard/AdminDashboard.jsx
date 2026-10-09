import { HiUsers, HiAcademicCap, HiCurrencyDollar, HiTrendingUp } from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SkeletonCard, SkeletonTable } from '../../components/ui/Skeleton';
import { useAdminAnalytics } from '../../hooks/useAnalytics';

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
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
          {trend && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <HiTrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { data: analyticsData, isLoading } = useAdminAnalytics();
  const analytics = analyticsData?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-9 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-96 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonTable rows={4} />
          <SkeletonTable rows={4} />
        </div>

        {/* Chart Skeleton */}
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
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1 text-sm">Welcome back! Here's what's happening with TUC Academy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics?.overview?.totalUsers?.toLocaleString() || '0'}
          icon={HiUsers}
          trend={analytics?.growth?.newUsersLast30Days ? `+${analytics.growth.newUsersLast30Days} last 30 days` : undefined}
          color="primary"
        />
        <StatCard
          title="Active Courses"
          value={analytics?.overview?.totalCourses?.toLocaleString() || '0'}
          icon={HiAcademicCap}
          color="accent"
        />
        <StatCard
          title="Revenue"
          value={`₦${Number(analytics?.overview?.revenue || 0).toLocaleString()}`}
          icon={HiCurrencyDollar}
          color="green"
        />
        <StatCard
          title="Enrollments"
          value={analytics?.overview?.activeEnrollments?.toLocaleString() || '0'}
          icon={HiTrendingUp}
          trend={analytics?.growth?.newEnrollmentsLast30Days ? `+${analytics.growth.newEnrollmentsLast30Days} last 30 days` : undefined}
          color="purple"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Users</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                  U{i}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">User {i}</p>
                  <p className="text-xs text-slate-500">user{i}@example.com</p>
                </div>
                <span className="text-xs text-slate-400">2h ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Management */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Course Management</h2>
          <div className="space-y-3">
            {[
              { name: 'Pending Approval', count: 5, color: 'text-amber-600' },
              { name: 'Published', count: 43, color: 'text-green-600' },
              { name: 'Draft', count: 12, color: 'text-slate-600' },
              { name: 'Archived', count: 8, color: 'text-red-600' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Platform Activity</h2>
        {analytics?.userGrowthData && analytics.userGrowthData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.userGrowthData}
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
                  dataKey="users"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <p>No activity data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
