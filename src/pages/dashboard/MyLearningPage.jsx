import { useState } from 'react';
import { FiSearch, FiBookOpen, FiClock } from 'react-icons/fi';
import { HiPlay, HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/dashboard/PageHeader';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/dashboard/ProgressBar';
import Skeleton from '../../components/ui/Skeleton';
import { useMyEnrollments } from '../../hooks/useEnrollments';
import { formatDistanceToNow } from 'date-fns';

const MyLearningPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, in-progress, completed

  const { data: enrollmentsData, isLoading } = useMyEnrollments();
  const enrollments = enrollmentsData?.data?.enrollments || [];

  // Filter courses
  const filteredCourses = enrollments.filter(enrollment => {
    const course = enrollment.course;
    const matchesSearch =
      course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${course?.instructor?.firstName} ${course?.instructor?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());

    const isCompleted = !!enrollment.completedAt;
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && isCompleted) ||
      (filterStatus === 'in-progress' && !isCompleted);

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (enrollment) => {
    if (enrollment.completedAt) {
      return <Badge variant="success">Completed</Badge>;
    }
    return <Badge variant="warning">In Progress</Badge>;
  };

  const gradients = {
    'gradient-1': 'from-blue-500 to-purple-600',
    'gradient-2': 'from-green-500 to-teal-600',
    'gradient-3': 'from-orange-500 to-red-600',
    'gradient-4': 'from-pink-500 to-purple-600',
    'gradient-5': 'from-indigo-500 to-blue-600',
    'gradient-6': 'from-yellow-500 to-orange-600',
  };

  const getGradient = (index) => {
    const gradientKeys = Object.keys(gradients);
    const key = gradientKeys[index % gradientKeys.length];
    return gradients[key];
  };

  const formatLastAccessed = (date) => {
    if (!date) return 'Never';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Learning"
        description="Track your progress and continue your learning journey"
      />

      {isLoading ? (
        <>
          {/* Courses Loading */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="w-full md:w-96 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('in-progress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'in-progress'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Enrolled Courses */}
          {filteredCourses.length === 0 ? (
            <div className="border border-gray-200 rounded-xl p-12 text-center bg-white">
              <FiBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Start learning by browsing available courses"}
              </p>
              <Link
                to="/dashboard/browse"
                className="inline-flex items-center justify-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((enrollment, index) => {
                const course = enrollment.course;
                const progress = enrollment.progressPercentage || 0;
                const isCompleted = !!enrollment.completedAt;

                return (
                  <div key={enrollment.id} className="overflow-hidden border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all max-w-sm">
                    {/* Course Thumbnail */}
                    <div className={`relative h-40 bg-gradient-to-br ${getGradient(index)}`}>
                      {isCompleted && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Completed
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                            {course?.title || 'Untitled Course'}
                          </h3>
                          <p className="text-xs text-gray-600">
                            by {course?.instructor?.firstName || 'Unknown'} {course?.instructor?.lastName || ''}
                          </p>
                        </div>
                        {getStatusBadge(enrollment)}
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium text-primary-600">
                            {progress}%
                          </span>
                        </div>
                        <ProgressBar progress={progress} showLabel={false} />
                      </div>

                      {/* Course Stats */}
                      <div className="flex flex-wrap items-center gap-2.5 mb-3 pb-3 border-b border-gray-200 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>{formatLastAccessed(enrollment.lastAccessedAt)}</span>
                        </div>
                        {course?.averageRating > 0 && (
                          <div className="flex items-center gap-1">
                            <HiStar className="w-3.5 h-3.5 text-amber-500" />
                            <span>{course.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        {isCompleted ? (
                          <>
                            <Link
                              to={`/dashboard/courses/${course?.id}/learn`}
                              className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium"
                            >
                              <HiPlay className="w-4 h-4" />
                              Review Course
                            </Link>
                            {enrollment.certificateId && (
                              <button className="w-full px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium">
                                View Certificate
                              </button>
                            )}
                          </>
                        ) : (
                          <Link
                            to={`/dashboard/courses/${course?.id}/learn`}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium"
                          >
                            <HiPlay className="w-4 h-4" />
                            Continue Learning
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyLearningPage;
