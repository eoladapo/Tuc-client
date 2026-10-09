import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiXMark,
  HiChevronRight,
  HiChevronDown,
  HiChevronUp,
  HiMagnifyingGlass,
  HiPlay,
  HiCheckCircle,
  HiDocumentText,
  HiQuestionMarkCircle,
  HiArrowLeft,
  HiArrowRight,
  HiBars3
} from 'react-icons/hi2';
import { useCourseDetails } from '../../hooks/useCourses';
import { useCourseProgress, useMarkLessonComplete } from '../../hooks/useProgress';
import { formatDuration } from '../../utils/formatters';
import { useSnackbar } from '../../hooks';
import { Snackbar } from '../../components/ui';

const CoursePlayerPageAlt = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: courseData, isLoading } = useCourseDetails(courseId);
  const { data: progressData, refetch: refetchProgress } = useCourseProgress(courseId);
  const { mutate: markComplete, isLoading: isMarkingComplete } = useMarkLessonComplete();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const course = courseData?.data;
  const modules = course?.modules || [];
  const courseProgress = progressData?.data;

  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [expandedModules, setExpandedModules] = useState([]);
  const [expandedSections, setExpandedSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  // Get all lessons flattened
  const allLessons = modules.flatMap(module =>
    (module.lessons || []).map(lesson => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title
    }))
  );

  // Filter lessons based on search
  const filteredModules = modules.map(module => ({
    ...module,
    lessons: (module.lessons || []).filter(lesson =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(module => module.lessons.length > 0);

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
        showSnackbar('Lesson marked as complete!', 'success');

        // Show celebration for course completion
        if (courseProgress && courseProgress.completedLessons + 1 === courseProgress.totalLessons) {
          setTimeout(() => {
            showSnackbar('🎊 Congratulations! You completed the course!', 'success');
          }, 1500);
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

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev =>
      prev.includes(sectionKey)
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  // Resize handler
  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 280 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleLessonClick = (lessonId, moduleId) => {
    setCurrentLessonId(lessonId);
    if (!expandedModules.includes(moduleId)) {
      setExpandedModules(prev => [...prev, moduleId]);
    }
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
        return <HiPlay className="w-4 h-4 text-blue-600" />;
      case 'quiz':
        return <HiQuestionMarkCircle className="w-4 h-4 text-purple-600" />;
      case 'text':
        return <HiDocumentText className="w-4 h-4 text-gray-600" />;
      default:
        return <HiDocumentText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getModuleProgress = (module) => {
    if (!courseProgress) return { completed: 0, total: 0 };
    const moduleLessons = module.lessons || [];
    const completedCount = moduleLessons.filter(lesson => {
      const lessonProgress = courseProgress.lessons?.find(l => l.lessonId === lesson.id);
      return lessonProgress?.status === 'completed';
    }).length;
    return { completed: completedCount, total: moduleLessons.length };
  };

  // Group lessons by section (based on order for demo - in real app, you'd have a section field)
  const getLessonSections = (lessons) => {
    const sections = {};
    lessons.forEach((lesson, index) => {
      const sectionIndex = Math.floor(index / 5); // Group every 5 lessons as a section
      const sectionKey = `section-${sectionIndex}`;
      if (!sections[sectionKey]) {
        sections[sectionKey] = {
          name: `Section ${sectionIndex + 1}`,
          lessons: []
        };
      }
      sections[sectionKey].lessons.push(lesson);
    });
    return sections;
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Course not found</h2>
          <p className="text-slate-600 mb-4">The course you're looking for doesn't exist.</p>
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
    <>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
      />

      <div className="h-screen bg-white flex flex-col">
        {/* Top Header */}
        <div className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/my-learning')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
              title="Exit course"
            >
              <HiXMark className="w-6 h-6" />
            </button>
            <div className="border-l border-slate-300 h-6"></div>
            <h1 className="text-base font-semibold text-slate-900 line-clamp-1">
              {course.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Indicator */}
            {courseProgress && (
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-slate-600">Progress:</span>
                <span className="font-semibold text-primary-600">
                  {courseProgress.progressPercentage}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Course Outline */}
          <div
            className="bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0 relative"
            style={{ width: `${sidebarWidth}px` }}
          >
            {/* Sidebar Header */}
            <div className="bg-white border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Course Outline</h2>

              {/* Search */}
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search course outline"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto">
              {(searchQuery ? filteredModules : modules).length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  {searchQuery ? 'No lessons found' : 'No modules available'}
                </div>
              ) : (
                <div className="py-2">
                  {(searchQuery ? filteredModules : modules).map((module, moduleIndex) => {
                    const moduleProgress = getModuleProgress(module);
                    const progressPercent = moduleProgress.total > 0
                      ? Math.round((moduleProgress.completed / moduleProgress.total) * 100)
                      : 0;
                    const isExpanded = expandedModules.includes(module.id);

                    return (
                      <div key={module.id} className="mb-1">
                        {/* Module Header */}
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-100 transition-colors text-left"
                        >
                          {isExpanded ? (
                            <HiChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          ) : (
                            <HiChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-900 mb-1">
                              Module {moduleIndex + 1}: {module.title}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-200 rounded-full h-1.5 max-w-[120px]">
                                <div
                                  className="bg-green-500 h-1.5 rounded-full transition-all"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-600">{progressPercent}%</span>
                            </div>
                          </div>
                        </button>

                        {/* Lessons */}
                        {isExpanded && (
                          <div className="bg-white">
                            {(module.lessons || []).map((lesson, lessonIndex) => {
                              const lessonProgress = courseProgress?.lessons?.find(
                                l => l.lessonId === lesson.id
                              );
                              const isCompleted = lessonProgress?.status === 'completed';
                              const isCurrent = currentLessonId === lesson.id;
                              const moduleLessons = module.lessons || [];
                              const isLastLesson = lessonIndex === moduleLessons.length - 1;

                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => handleLessonClick(lesson.id, module.id)}
                                  className={`w-full px-4 py-2.5 pl-11 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left border-l-2 relative ${isCurrent
                                    ? 'border-primary-600 bg-primary-50'
                                    : 'border-transparent'
                                    }`}
                                >
                                  <div className="flex-shrink-0 relative z-10">
                                    {/* Dotted connecting line - goes down from center of circle */}
                                    {!isLastLesson && (
                                      <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-[-8px] w-[1px] border-l border-dotted border-slate-300"></div>
                                    )}

                                    {isCompleted ? (
                                      <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center relative">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center relative">
                                        {lesson.type === 'video' && (
                                          <HiPlay className="w-3 h-3 text-blue-600" />
                                        )}
                                        {lesson.type === 'text' && (
                                          <HiDocumentText className="w-3 h-3 text-slate-600" />
                                        )}
                                        {lesson.type === 'quiz' && (
                                          <HiQuestionMarkCircle className="w-3 h-3 text-purple-600" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${isCurrent ? 'text-primary-700 font-medium' : 'text-slate-700'}`}>
                                      {lesson.title}
                                    </p>
                                    {lesson.videoDurationSeconds && (
                                      <p className="text-xs text-slate-500 mt-0.5">
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
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resize Handle */}
            <div
              className="absolute top-0 right-0 bottom-0 w-1 hover:w-1.5 bg-transparent hover:bg-primary-500 cursor-col-resize transition-all z-10"
              onMouseDown={handleMouseDown}
              title="Drag to resize sidebar"
            >
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-16 bg-slate-300 rounded-l-full"></div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Content Display */}
            <div className="flex-1 overflow-y-auto">
              {currentLesson ? (
                <>
                  {/* Lesson Title & Description - Above Video */}
                  <div className="w-full bg-white border-b border-slate-200 py-4 px-6">
                    <div className="max-w-5xl mx-auto">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {currentLesson.title}
                      </h2>
                      {currentLesson.description && (
                        <p className="text-slate-600 text-sm">
                          {currentLesson.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Video/Content Area */}
                  <div className="w-full bg-white py-8 px-6">
                    <div className="max-w-5xl mx-auto">
                      {currentLesson.type === 'video' && currentLesson.videoUrl ? (
                        <div className="bg-black rounded-lg overflow-hidden shadow-lg aspect-video">
                          <iframe
                            src={currentLesson.videoUrl}
                            className="w-full h-full"
                            allow="autoplay"
                            allowFullScreen
                            title={currentLesson.title}
                          />
                        </div>
                      ) : currentLesson.type === 'text' ? (
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                          <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            {currentLesson.title}
                          </h2>
                          <div className="prose max-w-none">
                            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                              {currentLesson.content || 'No content available for this lesson yet.'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-black rounded-lg overflow-hidden shadow-lg aspect-video flex items-center justify-center">
                          <div className="text-center text-white/70">
                            <HiQuestionMarkCircle className="w-16 h-16 mx-auto mb-3" />
                            <p className="text-sm">
                              {currentLesson.type === 'quiz' ? 'Quiz content will be displayed here' : 'Content not available'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transcript Section Only */}
                  <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">Transcript</h4>
                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                        {currentLesson.transcript ? (
                          <div className="prose max-w-none">
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                              {currentLesson.transcript}
                            </p>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-sm italic">
                            No transcript available for this lesson yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-slate-50">
                  <div className="text-center">
                    <HiDocumentText className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">Select a lesson to start learning</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            {currentLesson && (
              <div className="border-t border-slate-200 px-6 py-4 bg-white flex items-center justify-between">
                <button
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  {!isLessonCompleted ? (
                    <button
                      onClick={handleMarkComplete}
                      disabled={isMarkingComplete}
                      className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <HiCheckCircle className="w-4 h-4" />
                      {isMarkingComplete ? 'Marking...' : 'Mark as Complete'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg">
                      <HiCheckCircle className="w-4 h-4" />
                      Completed
                    </div>
                  )}

                  <button
                    onClick={handleNextLesson}
                    disabled={currentLessonIndex === allLessons.length - 1}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <HiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePlayerPageAlt;
