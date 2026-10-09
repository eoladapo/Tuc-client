import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiPlus, HiDotsVertical, HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { PageHeader } from '../../components/dashboard';
import { useAuthStore } from '../../store/authStore';

const CoursesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const courses = [
    { 
      id: 1, 
      title: 'Social Media Marketing Mastery', 
      instructor: 'Sarah Johnson',
      students: 234, 
      status: 'published',
      category: 'Marketing',
      price: 49.99,
      rating: 4.8,
      updated: '2024-02-15'
    },
    { 
      id: 2, 
      title: 'Brand Building Fundamentals', 
      instructor: 'Michael Chen',
      students: 189, 
      status: 'published',
      category: 'Branding',
      price: 39.99,
      rating: 4.9,
      updated: '2024-02-10'
    },
    { 
      id: 3, 
      title: 'Content Strategy Workshop', 
      instructor: 'Emily Davis',
      students: 120, 
      status: 'published',
      category: 'Content',
      price: 59.99,
      rating: 4.7,
      updated: '2024-02-20'
    },
    { 
      id: 4, 
      title: 'Instagram Growth Hacks', 
      instructor: 'Sarah Johnson',
      students: 0, 
      status: 'draft',
      category: 'Social Media',
      price: 29.99,
      rating: 0,
      updated: '2024-02-22'
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-slate-200 rounded animate-pulse" />
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
        title={user?.role === 'admin' ? 'All Courses' : 'My Courses'}
        description={user?.role === 'admin' ? 'Manage all platform courses' : 'Manage your courses and track performance'}
        action={
          <Link
            to="/dashboard/courses/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <HiPlus className="w-5 h-5" />
            Create Course
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Course Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500">
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  course.status === 'published'
                    ? 'bg-green-500 text-white'
                    : course.status === 'draft'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-500 text-white'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>

            {/* Course Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500">{course.instructor}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                <span>{course.students} students</span>
                {course.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    {course.rating}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-lg font-bold text-primary-600">
                  ${course.price}
                </span>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <HiEye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <HiPencil className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
