import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiEdit, FiUsers, FiStar, FiClock,
  FiAward, FiBook, FiPlayCircle, FiCheckCircle
} from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';
import { useCourseDetails } from '../../hooks/useCourses';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { formatRating } from '../../utils/formatters';

const CoursePreviewPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: courseData, isLoading, error } = useCourseDetails(courseId);

  const course = courseData?.data;
  const modules = course?.modules || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-2">The course you're looking for doesn't exist.</p>
          {error && (
            <p className="text-sm text-red-600 mb-4">
              Error: {error.response?.data?.message || error.message}
            </p>
          )}
          <button
            onClick={() => navigate('/dashboard/my-courses')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
  const totalDuration = modules.reduce((acc, module) => {
    return acc + (module.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard/my-courses')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to My Courses</span>
            </button>
            <div className="flex items-center gap-3">
              <Link
                to={`/dashboard/courses/${courseId}/learn`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <FiPlayCircle className="w-4 h-4" />
                Watch Course
              </Link>
              <Link
                to={`/dashboard/courses/${courseId}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <FiEdit className="w-4 h-4" />
                Edit Course
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Hero */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-primary-500 to-accent-500">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiAcademicCap className="w-32 h-32 text-white/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  {course.status === 'published' ? (
                    <Badge variant="success">Published</Badge>
                  ) : (
                    <Badge variant="warning">Draft</Badge>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiBook className="w-4 h-4" />
                        {course.category?.name || 'Uncategorized'}
                      </span>
                      <span className="capitalize">{course.level}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {course.price === 0 ? 'Free' : `₦${course.price}`}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <FiUsers className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {course.enrolledStudents || 0}
                    </div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <FiStar className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatRating(course.averageRating)}
                    </div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <FiPlayCircle className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {totalLessons}
                    </div>
                    <div className="text-xs text-gray-600">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {course.duration || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About this course
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>

            {/* Requirements */}
            {course.requirements && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {course.requirements}
                </p>
              </div>
            )}

            {/* What You'll Learn */}
            {course.whatYouWillLearn && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What you'll learn
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {course.whatYouWillLearn}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Course Content
              </h2>
              <div className="space-y-3">
                {modules.length === 0 ? (
                  <div className="text-center py-8">
                    <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">No modules yet</p>
                    <Link
                      to={`/dashboard/courses/${courseId}/edit`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
                    >
                      Add modules
                    </Link>
                  </div>
                ) : (
                  modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {module.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FiPlayCircle className="w-3 h-3" />
                              {module.lessons?.length || 0} lessons
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Instructor
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold">
                  {course.instructor?.firstName?.[0]}
                  {course.instructor?.lastName?.[0]}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {course.instructor?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewPage;
