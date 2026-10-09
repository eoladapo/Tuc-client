import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSave, FiEye,
  FiChevronDown, FiChevronRight, FiVideo, FiFileText, FiCheckCircle
} from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';
import PageHeader from '../../components/dashboard/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import Modal from '../../components/ui/Modal';
import {
  useCourseDetails,
  useUpdateCourse,
  useCreateModule,
  useDeleteModule,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson
} from '../../hooks/useCourses';
import toast from 'react-hot-toast';
import { convertToEmbedUrl } from '../../utils/videoUtils';

const EditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(null); // moduleId
  const [editingLesson, setEditingLesson] = useState(null); // lessonId being edited
  const [moduleFormData, setModuleFormData] = useState({ title: '', description: '' });
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '',
    videoUrl: ''
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'module' or 'lesson'
    id: null,
    title: ''
  });

  const { data: courseData, isLoading } = useCourseDetails(courseId);
  const { mutate: updateCourse } = useUpdateCourse();
  const { mutate: createModule, isPending: isCreatingModule } = useCreateModule();
  const { mutate: deleteModule } = useDeleteModule();
  const { mutate: createLesson, isPending: isCreatingLesson } = useCreateLesson();
  const { mutate: updateLesson, isPending: isUpdatingLesson } = useUpdateLesson();
  const { mutate: deleteLesson } = useDeleteLesson();

  // Response structure is courseData.data (the course object directly)
  const course = courseData?.data;
  const modules = course?.modules || [];

  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handlePublishToggle = () => {
    if (!course) return;

    const newStatus = course.status === 'published' ? 'draft' : 'published';

    updateCourse({
      courseId: course.id,
      data: { status: newStatus }
    }, {
      onSuccess: () => {
        toast.success(
          newStatus === 'published'
            ? 'Course published successfully'
            : 'Course unpublished successfully'
        );
      }
    });
  };

  const handleCreateModule = (e) => {
    e.preventDefault();
    if (!moduleFormData.title.trim()) {
      toast.error('Module title is required');
      return;
    }

    if (!moduleFormData.description.trim() || moduleFormData.description.length < 10) {
      toast.error('Module description is required (minimum 10 characters)');
      return;
    }

    createModule({
      courseId,
      data: {
        title: moduleFormData.title,
        description: moduleFormData.description,
        orderIndex: modules.length
      }
    }, {
      onSuccess: () => {
        setModuleFormData({ title: '', description: '' });
        setShowModuleForm(false);
      }
    });
  };

  const handleDeleteModule = (moduleId, moduleTitle) => {
    setDeleteModal({
      isOpen: true,
      type: 'module',
      id: moduleId,
      title: moduleTitle
    });
  };

  const handleDeleteLesson = (lessonId, lessonTitle) => {
    setDeleteModal({
      isOpen: true,
      type: 'lesson',
      id: lessonId,
      title: lessonTitle
    });
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'module') {
      deleteModule(deleteModal.id, {
        onSuccess: () => {
          toast.success('Module deleted successfully');
          closeDeleteModal();
        }
      });
    } else if (deleteModal.type === 'lesson') {
      deleteLesson(deleteModal.id, {
        onSuccess: () => {
          toast.success('Lesson deleted successfully');
          closeDeleteModal();
        }
      });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      type: null,
      id: null,
      title: ''
    });
  };

  const handleCreateLesson = (e, moduleId) => {
    e.preventDefault();
    if (!lessonFormData.title.trim()) {
      toast.error('Lesson title is required');
      return;
    }

    // Convert and trim video URL
    const processedVideoUrl = lessonFormData.videoUrl
      ? convertToEmbedUrl(lessonFormData.videoUrl.trim())
      : undefined;

    createLesson({
      moduleId,
      data: {
        title: lessonFormData.title.trim(),
        description: lessonFormData.description?.trim() || undefined,
        type: lessonFormData.type,
        videoDurationSeconds: lessonFormData.duration ? parseInt(lessonFormData.duration) : undefined,
        videoUrl: processedVideoUrl,
        orderIndex: (modules.find(m => m.id === moduleId)?.lessons?.length || 0)
      }
    }, {
      onSuccess: () => {
        setLessonFormData({ title: '', description: '', type: 'video', duration: '', videoUrl: '' });
        setShowLessonForm(null);
      }
    });
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson.id);
    setLessonFormData({
      title: lesson.title,
      description: lesson.description || '',
      type: lesson.type,
      duration: lesson.videoDurationSeconds?.toString() || '',
      videoUrl: lesson.videoUrl || ''
    });
  };

  const handleUpdateLesson = (e) => {
    e.preventDefault();
    if (!lessonFormData.title.trim()) {
      toast.error('Lesson title is required');
      return;
    }

    // Convert and trim video URL
    const processedVideoUrl = lessonFormData.videoUrl
      ? convertToEmbedUrl(lessonFormData.videoUrl.trim())
      : undefined;

    updateLesson({
      lessonId: editingLesson,
      data: {
        title: lessonFormData.title.trim(),
        description: lessonFormData.description?.trim() || undefined,
        type: lessonFormData.type,
        videoDurationSeconds: lessonFormData.duration ? parseInt(lessonFormData.duration) : undefined,
        videoUrl: processedVideoUrl,
      }
    }, {
      onSuccess: () => {
        setEditingLesson(null);
        setLessonFormData({ title: '', description: '', type: 'video', duration: '', videoUrl: '' });
        toast.success('Lesson updated successfully');
      }
    });
  };

  const cancelEditLesson = () => {
    setEditingLesson(null);
    setLessonFormData({ title: '', description: '', type: 'video', duration: '', videoUrl: '' });
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <FiVideo className="w-4 h-4" />;
      case 'quiz':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'text':
        return <FiFileText className="w-4 h-4" />;
      default:
        return <FiFileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <HiAcademicCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Course not found</h3>
        <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard/my-courses')}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title={`Delete ${deleteModal.type === 'module' ? 'Module' : 'Lesson'}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {deleteModal.type === 'module' ? (
              <>
                Are you sure you want to delete <strong>"{deleteModal.title}"</strong>?
                <br />
                <span className="text-red-600 font-medium">All lessons in this module will also be deleted.</span>
              </>
            ) : (
              <>
                Are you sure you want to delete <strong>"{deleteModal.title}"</strong>?
                <br />
                This action cannot be undone.
              </>
            )}
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Delete {deleteModal.type === 'module' ? 'Module' : 'Lesson'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/dashboard/my-courses')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-1">Add modules and lessons to your course</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/dashboard/courses/${courseId}/preview`)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <FiEye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={handlePublishToggle}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${course.status === 'published'
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
              }`}
          >
            {course.status === 'published' ? 'Unpublish' : 'Publish Course'}
          </button>
        </div>
      </div>

      {/* Course Curriculum */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Course Curriculum</h2>
          <button
            onClick={() => setShowModuleForm(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Module
          </button>
        </div>

        {/* Add Module Form */}
        {showModuleForm && (
          <form onSubmit={handleCreateModule} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">New Module</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Module title (e.g., Introduction to Social Media)"
                value={moduleFormData.title}
                onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                autoFocus
              />
              <textarea
                placeholder="Module description (minimum 10 characters) *"
                value={moduleFormData.description}
                onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isCreatingModule}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  {isCreatingModule ? 'Adding...' : 'Add Module'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModuleForm(false);
                    setModuleFormData({ title: '', description: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Modules List */}
        {modules.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <HiAcademicCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No modules yet. Add your first module to get started.</p>
            {!showModuleForm && (
              <button
                onClick={() => setShowModuleForm(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                Add Module
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((module, index) => (
              <div key={module.id} className="border border-gray-200 rounded-lg">
                {/* Module Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {expandedModules.includes(module.id) ? (
                        <FiChevronDown className="w-5 h-5" />
                      ) : (
                        <FiChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Module {index + 1}: {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {module.lessons?.length || 0} lessons
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowLessonForm(module.id)}
                      className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium flex items-center gap-1"
                    >
                      <FiPlus className="w-3.5 h-3.5" />
                      Add Lesson
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id, module.title)}
                      className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Module Content */}
                {expandedModules.includes(module.id) && (
                  <div className="p-4 space-y-3">
                    {/* Add Lesson Form */}
                    {showLessonForm === module.id && (
                      <form onSubmit={(e) => handleCreateLesson(e, module.id)} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">New Lesson</h4>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Lesson title"
                            value={lessonFormData.title}
                            onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                          <textarea
                            placeholder="Lesson description (optional)"
                            value={lessonFormData.description}
                            onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                          />
                          <input
                            type="url"
                            placeholder="Video URL (Google Drive, YouTube, Vimeo, etc.)"
                            value={lessonFormData.videoUrl}
                            onChange={(e) => setLessonFormData({ ...lessonFormData, videoUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <select
                              value={lessonFormData.type}
                              onChange={(e) => setLessonFormData({ ...lessonFormData, type: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                            >
                              <option value="video">Video</option>
                              <option value="text">Text/Article</option>
                              <option value="quiz">Quiz</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Duration (e.g., 10:30)"
                              value={lessonFormData.duration}
                              onChange={(e) => setLessonFormData({ ...lessonFormData, duration: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              disabled={isCreatingLesson}
                              className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-xs disabled:opacity-50"
                            >
                              {isCreatingLesson ? 'Adding...' : 'Add Lesson'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowLessonForm(null);
                                setLessonFormData({ title: '', description: '', type: 'video', duration: '', videoUrl: '' });
                              }}
                              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Lessons List */}
                    {module.lessons && module.lessons.length > 0 ? (
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          editingLesson === lesson.id ? (
                            // Edit Form
                            <form key={lesson.id} onSubmit={handleUpdateLesson} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Edit Lesson</h4>
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  placeholder="Lesson title"
                                  value={lessonFormData.title}
                                  onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                />
                                <textarea
                                  placeholder="Lesson description (optional)"
                                  value={lessonFormData.description}
                                  onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                                />
                                <input
                                  type="url"
                                  placeholder="Video URL (Google Drive, YouTube, Vimeo, etc.)"
                                  value={lessonFormData.videoUrl}
                                  onChange={(e) => setLessonFormData({ ...lessonFormData, videoUrl: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <select
                                    value={lessonFormData.type}
                                    onChange={(e) => setLessonFormData({ ...lessonFormData, type: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                  >
                                    <option value="video">Video</option>
                                    <option value="text">Text/Article</option>
                                    <option value="quiz">Quiz</option>
                                  </select>
                                  <input
                                    type="text"
                                    placeholder="Duration (e.g., 10:30)"
                                    value={lessonFormData.duration}
                                    onChange={(e) => setLessonFormData({ ...lessonFormData, duration: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="submit"
                                    disabled={isUpdatingLesson}
                                    className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-xs disabled:opacity-50"
                                  >
                                    {isUpdatingLesson ? 'Saving...' : 'Save Changes'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEditLesson}
                                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </form>
                          ) : (
                            // Display Mode
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="text-gray-400">
                                  {getLessonIcon(lesson.type)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {lessonIndex + 1}. {lesson.title}
                                  </p>
                                  {lesson.duration && (
                                    <p className="text-xs text-gray-500 mt-0.5">{lesson.duration}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditLesson(lesson)}
                                  className="px-2 py-1 text-primary-600 hover:bg-primary-50 rounded transition-colors text-xs"
                                  title="Edit lesson"
                                >
                                  <FiEdit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-xs"
                                  title="Delete lesson"
                                >
                                  <FiTrash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No lessons yet. Click "Add Lesson" to create one.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCoursePage;
