import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiChevronLeft, FiChevronRight,
  FiBook, FiClock, FiX, FiMenu, FiFileText, FiCheckCircle
} from 'react-icons/fi';
import { BsFillPlayCircleFill, BsCheckCircleFill } from 'react-icons/bs';
import { useCourseDetails } from '../../hooks/useCourses';
import { useCourseProgress, useMarkLessonComplete } from '../../hooks/useProgress';
import { formatDuration } from '../../utils/formatters';
import toast from 'react-hot-toast';

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: courseData, isLoading } = useCourseDetails(courseId);
  const { data: progressData, refetch: refetchProgress } = useCourseProgress(courseId);
  const { mutate: markComplete, isLoading: isMarkingComplete } = useMarkLessonComplete();

  const course = courseData?.data;
  const modules = course?.modules || [];
  const courseProgress = progressData?.data;

  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState([]);

  // Get all lessons flattened
  const allLessons = modules.flatMap(module =>
    (module.lessons || []).map(lesson => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title
    }))
  );

  // Set first lesson as current if none selected
  useEffect(() => {
    if (allLessons.length > 0 && !currentLessonId) {
      setCurrentLessonId(allLessons[0].id);
      setExpandedModules([allLessons[0].moduleId]);
    }
  }, [allLessons.length]);

  const currentLesson = allLessons.find(l => l.id === currentLessonId);
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLessonId);

  // Check if current lesson is completed
  const currentLessonProgress = courseProgress?.lessons?.find(
    l => l.lessonId === currentLessonId
  );
  const isLessonCompleted = currentLessonProgress?.status === 'completed';

  const handleMarkComplete = () => {
    if (!currentLessonId) return;

    markComplete(currentLessonId, {
      onSuccess: () => {
        refetchProgress();
        // Show celebration for course completion
        if (courseProgress && courseProgress.completedLessons + 1 === courseProgress.totalLessons) {
          toast.success('🎊 Congratulations! You completed the course!', {
            duration: 5000,
            icon: '🏆',
          });
        }
      }
    });
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLessonClick = (lessonId) => {
    setCurrentLessonId(lessonId);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setCurrentLessonId(nextLesson.id);
      if (!expandedModules.includes(nextLesson.moduleId)) {
        setExpandedModules(prev => [...prev, nextLesson.moduleId]);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      setCurrentLessonId(prevLesson.id);
      if (!expandedModules.includes(prevLesson.moduleId)) {
        setExpandedModules(prev => [...prev, prevLesson.moduleId]);
      }
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <BsFillPlayCircleFill className="w-3.5 h-3.5 text-primary-600" />;
      case 'quiz':
        return <BsCheckCircleFill className="w-3.5 h-3.5 text-green-600" />;
      case 'text':
        return <FiFileText className="w-3.5 h-3.5 text-gray-600" />;
      default:
        return <FiBook className="w-3.5 h-3.5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-gray-900 font-semibold text-sm line-clamp-1">
              {course.title}
            </h1>
            <p className="text-gray-500 text-xs">
              {currentLesson?.moduleTitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          title={sidebarOpen ? 'Hide course content' : 'Show course content'}
        >
          {sidebarOpen ? (
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <FiChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
          {/* Video/Content Area - Full Width */}
          <div className="w-full h-[75vh] bg-black flex items-center justify-center flex-shrink-0">
            {currentLesson ? (
              <div className="w-full h-full">
                {currentLesson.type === 'video' && currentLesson.videoUrl ? (
                  // Embed Google Drive video or other video URL
                  <iframe
                    src={currentLesson.videoUrl}
                    className="w-full h-full"
                    allow="autoplay"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                ) : currentLesson.type === 'text' ? (
                  <div className="w-full h-full overflow-auto bg-white">
                    <div className="max-w-4xl mx-auto p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentLesson.title}</h2>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                          {currentLesson.content || 'No content available for this lesson yet.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <FiFileText className="w-16 h-16 text-gray-400 mb-3 mx-auto" />
                    <p className="text-gray-300 text-sm">
                      {currentLesson.type === 'quiz' ? 'Quiz content will be displayed here' : 'Content not available'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <FiBook className="w-16 h-16 text-white/50 mb-3 mx-auto" />
                <p className="text-white/70 text-sm">Select a lesson to start</p>
              </div>
            )}
          </div>

          {/* Lesson Info & Navigation */}
          {currentLesson && (
            <div className="w-full bg-white border-t border-gray-200 px-5 py-3 shadow-sm">
              <div className="mx-auto">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-gray-900 font-semibold text-sm mb-1">
                      {currentLesson.title}
                    </h3>
                    {currentLesson.description && (
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {currentLesson.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs flex-shrink-0">
                    {currentLesson.videoDurationSeconds && (
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5" />
                        {formatDuration(currentLesson.videoDurationSeconds)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={currentLessonIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                  >
                    <FiChevronLeft className="w-3.5 h-3.5" />
                    Previous
                  </button>

                  {/* Mark as Complete Button */}
                  {!isLessonCompleted ? (
                    <button
                      onClick={handleMarkComplete}
                      disabled={isMarkingComplete}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-xs font-medium shadow-sm"
                    >
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      {isMarkingComplete ? 'Marking...' : 'Mark Complete'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                      <BsCheckCircleFill className="w-3.5 h-3.5" />
                      Completed
                    </div>
                  )}

                  <button
                    onClick={handleNextLesson}
                    disabled={currentLessonIndex === allLessons.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                  >
                    Next
                    <FiChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Course Content */}
        <div
          className={`${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            } fixed lg:relative top-0 right-0 h-full w-80 lg:w-[340px] bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col shadow-xl lg:shadow-none`}
        >
          {/* Sidebar Header with Progress */}
          <div className="px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-900 font-semibold text-sm">Course Content</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors lg:hidden"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            {courseProgress && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    {courseProgress.completedLessons} of {courseProgress.totalLessons} completed
                  </span>
                  <span className="text-primary-600 font-semibold">
                    {courseProgress.progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${courseProgress.progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modules & Lessons List */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {modules.length === 0 ? (
              <div className="p-4 text-center">
                <FiBook className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-xs">No modules available yet</p>
              </div>
            ) : (
              <div className="py-1">
                {modules.map((module, moduleIndex) => (
                  <div key={module.id} className="mb-0.5">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-100 transition-colors bg-white"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {moduleIndex + 1}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <h3 className="text-gray-900 font-medium text-xs line-clamp-1">
                            {module.title}
                          </h3>
                          <p className="text-gray-500 text-[10px] mt-0.5">
                            {module.lessons?.length || 0} lessons
                          </p>
                        </div>
                      </div>
                      <FiChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expandedModules.includes(module.id) ? 'rotate-90' : ''
                          }`}
                      />
                    </button>

                    {/* Lessons */}
                    {expandedModules.includes(module.id) && (
                      <div className="bg-gray-50">
                        {(module.lessons || []).map((lesson, lessonIndex) => {
                          const lessonProgress = courseProgress?.lessons?.find(
                            l => l.lessonId === lesson.id
                          );
                          const isCompleted = lessonProgress?.status === 'completed';

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleLessonClick(lesson.id)}
                              className={`w-full px-3 py-2 pl-11 flex items-center gap-2.5 hover:bg-gray-100 transition-colors ${currentLessonId === lesson.id ? 'bg-primary-50 border-l-3 border-primary-600' : ''
                                }`}
                            >
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <BsCheckCircleFill className="w-3.5 h-3.5 text-green-600" />
                                ) : (
                                  getLessonIcon(lesson.type)
                                )}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p
                                  className={`text-xs font-medium line-clamp-2 ${currentLessonId === lesson.id
                                    ? 'text-primary-700'
                                    : 'text-gray-700'
                                    }`}
                                >
                                  {lessonIndex + 1}. {lesson.title}
                                </p>
                                {lesson.videoDurationSeconds && (
                                  <p className="text-[10px] text-gray-500 mt-0.5">
                                    {formatDuration(lesson.videoDurationSeconds)}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CoursePlayerPage;
