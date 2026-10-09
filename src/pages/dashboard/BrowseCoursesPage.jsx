import { useState, useEffect } from 'react';
import { HiSearch, HiFilter, HiStar, HiClock, HiUsers, HiPlay } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/dashboard';
import Select from '../../components/ui/Select';
import Skeleton from '../../components/ui/Skeleton';
import { useCourses, useCategories } from '../../hooks/useCourses';
import { useEnrollCourse } from '../../hooks/useEnrollments';
import { useInitiatePayment } from '../../hooks/usePayments';
import { formatRating } from '../../utils/formatters';

const BrowseCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Fetch courses with filters
  const { data: coursesData, isLoading: coursesLoading, refetch } = useCourses({
    search: searchQuery,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    level: selectedLevel !== 'all' ? selectedLevel : undefined,
    sortBy,
  });

  // Force refetch when component mounts to ensure fresh enrollment status
  useEffect(() => {
    // Small delay to ensure auth token is ready
    const timer = setTimeout(() => {
      refetch();
    }, 100);
    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  // Fetch categories
  const { data: categoriesData } = useCategories();

  // Enroll mutation (for free courses)
  const { mutate: enrollCourse, isPending: isEnrolling } = useEnrollCourse();

  // Payment mutation (for paid courses)
  const { mutate: initiatePayment, isPending: isInitiatingPayment } = useInitiatePayment();

  const courses = coursesData?.data?.courses || [];
  const categories = categoriesData?.data?.categories || [];

  // Function to calculate total course duration
  const calculateCourseDuration = (course) => {
    if (!course.modules || course.modules.length === 0) return '0h';

    let totalSeconds = 0;
    course.modules.forEach(module => {
      if (module.lessons && module.lessons.length > 0) {
        module.lessons.forEach(lesson => {
          totalSeconds += lesson.videoDurationSeconds || 0;
        });
      }
    });

    if (totalSeconds === 0) return '0h';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rated', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  const gradients = {
    'gradient-1': 'from-blue-500 to-purple-600',
    'gradient-2': 'from-green-500 to-teal-600',
    'gradient-3': 'from-orange-500 to-red-600',
    'gradient-4': 'from-pink-500 to-purple-600',
    'gradient-5': 'from-indigo-500 to-blue-600',
    'gradient-6': 'from-yellow-500 to-orange-600',
  };

  // Function to get gradient based on index
  const getGradient = (index) => {
    const gradientKeys = Object.keys(gradients);
    const key = gradientKeys[index % gradientKeys.length];
    return gradients[key];
  };

  const handleEnroll = (courseId, coursePrice) => {
    if (coursePrice === 0) {
      // Free course - enroll directly
      const paymentData = {};
      enrollCourse({ courseId, paymentData });
    } else {
      // Paid course - initiate payment with Paystack
      const callbackUrl = `${window.location.origin}/payment/callback`;
      initiatePayment({ courseId, callbackUrl });
    }
  };

  const isProcessing = isEnrolling || isInitiatingPayment;

  if (coursesLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-96 bg-slate-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="h-48 bg-slate-200 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Courses"
        description="Discover courses to boost your marketing and branding skills"
      />

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Search - Left Side */}
        <div className="relative w-80">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm placeholder:text-slate-400"
          />
        </div>

        {/* Dropdowns - Right Side */}
        <div className="flex gap-2 items-center">
          <div className="w-36">
            <Select
              value={selectedLevel}
              onChange={setSelectedLevel}
              options={levelOptions}
              placeholder="Level"
            />
          </div>

          <div className="w-40">
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{courses.length}</span> courses
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div key={course.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all group max-w-sm">
            {/* Thumbnail */}
            <div className={`relative h-40 bg-gradient-to-br ${getGradient(index)}`}>
              {course.isEnrolled && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                  Enrolled
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-semibold rounded-full">
                  {course.level}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-2">
                <span className="text-xs font-medium text-primary-600">{course.category?.name || 'Uncategorized'}</span>
                <h3 className="font-semibold text-slate-900 mt-1 line-clamp-2 text-sm">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">by {course.instructor?.firstName} {course.instructor?.lastName}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-slate-600 mb-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-1">
                  <HiStar className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">{formatRating(course.averageRating)}</span>
                  <span>({course.totalReviews || 0})</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiUsers className="w-4 h-4" />
                  <span>{course.enrolledCount?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiClock className="w-4 h-4" />
                  <span>{calculateCourseDuration(course)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-slate-900">
                    {course.price === 0 ? 'Free' : `₦${course.price}`}
                  </span>
                </div>
                {course.isEnrolled ? (
                  <Link
                    to={`/dashboard/courses/${course.id}/learn`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-xs"
                  >
                    <HiPlay className="w-3.5 h-3.5" />
                    Continue
                  </Link>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id, course.price)}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                        {course.price === 0 ? 'Enrolling...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        {course.price === 0 ? 'Enroll Free' : `Enroll - ₦${course.price}`}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          Previous
        </button>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">
          1
        </button>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          2
        </button>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          3
        </button>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          Next
        </button>
      </div>
    </div>
  );
};

export default BrowseCoursesPage;
