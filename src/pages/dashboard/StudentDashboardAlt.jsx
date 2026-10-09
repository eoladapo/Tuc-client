import { useState } from 'react';
import {
  HiAcademicCap,
  HiPlay,
  HiSquares2X2,
  HiListBullet,
  HiTrophy,
  HiCalendar,
  HiChevronRight,
  HiClock,
  HiCheckCircle
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useMyEnrollments } from '../../hooks/useEnrollments';
import { Badge } from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';

const StudentDashboardAlt = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all'); // 'all', 'in-progress', 'completed'

  const { data: enrollmentsData, isLoading } = useMyEnrollments();
  const enrollments = enrollmentsData?.data?.enrollments || [];

  // Filter enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'in-progress') return !enrollment.completedAt;
    if (filter === 'completed') return enrollment.completedAt;
    return true;
  });

  const completedCount = enrollments.filter(e => e.completedAt && e.progressPercentage === 100).length;
  const inProgressCount = enrollments.filter(e => !e.completedAt || e.progressPercentage < 100).length;

  const gradients = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-pink-600',
    'from-indigo-500 to-blue-600',
    'from-red-500 to-orange-600',
    'from-purple-500 to-pink-600',
  ];

  const getGradient = (index) => gradients[index % gradients.length];

  if (isLoading) {
    return (
      <div className="flex gap-6">
        <div className="flex-1">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
        <div className="w-80">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiAcademicCap className="w-7 h-7 text-primary-600" />
            My Learning
          </h1>
        </div>

        {/* Filter Tabs & View Toggle */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                All ({enrollments.length})
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'in-progress'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                In Progress ({inProgressCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'completed'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                Completed ({completedCount})
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
                title="Grid view"
              >
                <HiSquares2X2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
                title="List view"
              >
                <HiListBullet className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Course List/Grid */}
        {filteredEnrollments.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiAcademicCap className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {filter === 'all' ? 'No Courses Yet' : `No ${filter.replace('-', ' ')} courses`}
            </h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all'
                ? 'Start your learning journey by enrolling in a course'
                : `You don't have any ${filter.replace('-', ' ')} courses yet`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/dashboard/browse"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Browse Courses
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEnrollments.map((enrollment, index) => {
              const course = enrollment.course;
              const progress = enrollment.progressPercentage || 0;

              return (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Thumbnail */}
                  <div className={`relative h-40 bg-gradient-to-br ${getGradient(index)}`}>
                    {enrollment.completedAt && progress === 100 && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="success">Completed</Badge>
                      </div>
                    )}
                    {(!enrollment.completedAt || progress < 100) && progress > 0 && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="primary">{progress}%</Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="text-xs text-slate-500 mb-1">
                      {course?.category?.name || 'Course'}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {course?.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3">
                      {course?.instructor?.firstName} {course?.instructor?.lastName}
                    </p>

                    {/* Progress Bar */}
                    {!enrollment.completedAt && (
                      <div className="mb-3">
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div
                            className="bg-primary-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Continue Button */}
                    <Link
                      to={`/dashboard/courses/${course?.id}/learn`}
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <HiPlay className="w-4 h-4" />
                      {enrollment.completedAt && progress === 100 ? 'Review' : 'Continue Learning'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEnrollments.map((enrollment, index) => {
              const course = enrollment.course;
              const progress = enrollment.progressPercentage || 0;

              return (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className={`relative w-24 h-24 rounded-lg bg-gradient-to-br ${getGradient(index)} flex-shrink-0`}>
                      {enrollment.completedAt && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <HiCheckCircle className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-slate-900 mb-1">
                            {course?.title}
                          </h3>
                          <p className="text-sm text-slate-600 mb-2">
                            {course?.instructor?.firstName} {course?.instructor?.lastName}
                          </p>

                          {/* Progress */}
                          {!enrollment.completedAt && (
                            <div className="flex items-center gap-3">
                              <div className="flex-1 max-w-xs">
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div
                                    className="bg-primary-600 h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-xs font-medium text-slate-600">{progress}%</span>
                            </div>
                          )}
                          {enrollment.completedAt && progress === 100 && (
                            <Badge variant="success">Completed</Badge>
                          )}
                        </div>

                        {/* Action Button */}
                        <Link
                          to={`/dashboard/courses/${course?.id}/learn`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          <HiPlay className="w-4 h-4" />
                          {enrollment.completedAt ? 'Review' : 'Continue'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
        {/* Latest Achievements */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Latest Achievements</h3>
            <Link to="/dashboard/achievements" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              Show all
            </Link>
          </div>

          {completedCount === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <HiTrophy className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">
                You have no badges and certificates to display!
              </p>
              <p className="text-xs text-slate-600 mb-4">
                Enroll into a course to earn your badge and certificate.
              </p>
              <Link
                to="/dashboard/browse"
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Browse catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments
                .filter(e => e.completedAt)
                .slice(0, 3)
                .map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <HiTrophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                        {enrollment.course?.title}
                      </p>
                      <p className="text-xs text-slate-600">
                        Completed {new Date(enrollment.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Upcoming Assignments</h3>
            <Link to="/dashboard/assignments" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              Show all
            </Link>
          </div>

          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <HiCalendar className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-slate-900 mb-1">
              No Upcoming Assignments For Now
            </p>
            <p className="text-xs text-slate-600">
              Watch this space for upcoming assignments!
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg p-5 text-white">
          <h3 className="text-sm font-semibold mb-4">Your Progress</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Courses</span>
              <span className="text-lg font-bold">{enrollments.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">In Progress</span>
              <span className="text-lg font-bold">{inProgressCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <span className="text-lg font-bold">{completedCount}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default StudentDashboardAlt;
