import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiUsers,
  FiStar, FiDollarSign, FiMoreVertical, FiAlertTriangle
} from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';
import PageHeader from '../../components/dashboard/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import Modal from '../../components/ui/Modal';
import { useMyCourses, useDeleteCourse } from '../../hooks/useCourses';
import { formatRating } from '../../utils/formatters';

const MyCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, course: null });

  const { data: coursesData, isLoading, refetch } = useMyCourses();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const courses = coursesData?.data?.courses || [];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && course.status === 'published') ||
      (filterStatus === 'draft' && course.status === 'draft');
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (course) => {
    setDeleteModal({ isOpen: true, course });
  };

  const confirmDelete = () => {
    if (deleteModal.course) {
      deleteCourse(deleteModal.course.id, {
        onSuccess: () => {
          setDeleteModal({ isOpen: false, course: null });
        }
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, course: null });
  };

  const getStatusBadge = (course) => {
    if (course.status === 'published') {
      return <Badge variant="success">Published</Badge>;
    }
    return <Badge variant="warning">Draft</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-5 w-64 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader
          title="My Courses"
          description="Manage your courses and track performance"
        />
        <Link
          to="/dashboard/courses/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
        >
          <FiPlus className="w-4 h-4" />
          Create Course
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
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
            onClick={() => setFilterStatus('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'published'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'draft'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <HiAcademicCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No courses found' : 'No courses yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Create your first course to start teaching'}
          </p>
          {!searchQuery && (
            <Link
              to="/dashboard/courses/create"
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <FiPlus className="w-5 h-5" />
              Create Your First Course
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden border border-gray-200 max-w-sm">
              {/* Course Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-primary-400 to-accent-500">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiAcademicCap className="w-16 h-16 text-white/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(course)}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {course.category?.name || 'Uncategorized'} • {course.level}
                  </p>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <FiUsers className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-900">
                      {course.enrolledCount || 0}
                    </p>
                    <p className="text-[10px] text-gray-600">Students</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <FiStar className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-900">
                      {formatRating(course.averageRating)}
                    </p>
                    <p className="text-[10px] text-gray-600">Rating</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <FiDollarSign className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-900">
                      {course.price === 0 ? 'Free' : `₦${course.price}`}
                    </p>
                    <p className="text-[10px] text-gray-600">Price</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/dashboard/courses/${course.id}/edit`}
                    className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium"
                  >
                    <FiEdit className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  <Link
                    to={`/dashboard/courses/${course.id}/preview`}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
                  >
                    <FiEye className="w-3.5 h-3.5 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(course)}
                    className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium"
                  >
                    <FiTrash2 className="w-3.5 h-3.5 inline" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredCourses.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        title="Delete Course"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete <span className="font-semibold">"{deleteModal.course?.title}"</span>?
              </p>
              <p className="text-sm text-gray-600 mt-2">
                This action cannot be undone. All course content, modules, and lessons will be permanently deleted.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={cancelDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="w-4 h-4" />
                  Delete Course
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyCoursesPage;
