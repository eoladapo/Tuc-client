import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import PageHeader from '../../components/dashboard/PageHeader';
import { useCreateCourse, useCategories } from '../../hooks/useCourses';
import { courseAPI } from '../../api/course.api';
import { Input } from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import toast from 'react-hot-toast';

const courseSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  categoryId: z.string().min(1, 'Please select a category'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0, 'Price must be 0 or greater'),
  duration: z.string().optional(),
  language: z.string().default('English'),
  requirements: z.string().optional(),
  whatYouWillLearn: z.string().optional(),
});

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const { mutate: createCourse, isPending } = useCreateCourse();
  const { data: categoriesData } = useCategories();

  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: 'beginner',
      price: 0,
      language: 'English',
    },
  });

  const selectedLevel = watch('level');
  const selectedCategoryId = watch('categoryId');

  const levelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name,
  }));

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const onSubmit = async (data) => {

    try {
      let thumbnailUrl = undefined;

      // Upload thumbnail to Cloudinary if provided
      if (thumbnail) {
        toast.loading('Uploading thumbnail...', { id: 'thumbnail-upload' });
        try {
          const uploadResponse = await courseAPI.uploadThumbnail(thumbnail);
          thumbnailUrl = uploadResponse.data.url;
          toast.success('Thumbnail uploaded!', { id: 'thumbnail-upload' });
        } catch (error) {
          toast.error('Failed to upload thumbnail', { id: 'thumbnail-upload' });
          // Continue without thumbnail
        }
      }

      const formData = {
        ...data,
        price: parseFloat(data.price),
        // Ensure categoryId is a string
        categoryId: String(data.categoryId),
        // Add thumbnailUrl from Cloudinary
        thumbnailUrl,
      };


      createCourse(formData, {
        onSuccess: (response) => {
          toast.success('Course created successfully!');
          // Response structure is response.data (the course object)
          const courseId = response.data?.id || response.id;
          navigate(`/dashboard/courses/${courseId}/edit`);
        },
        onError: (error) => {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to create course';

          if (error.response?.status === 409) {
            toast.error('A course with this title already exists. Please use a different title.');
          } else {
            toast.error(errorMessage);
          }
        },
      });
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/my-courses')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <PageHeader
          title="Create New Course"
          description="Fill in the details to create your course"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Course Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div className="space-y-4">
            {/* Course Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Course Title *
              </label>
              <Input
                {...register('title')}
                placeholder="e.g., Complete Social Media Marketing Masterclass"
                error={errors.title?.message}
              />
            </div>

            {/* Course Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Course Description *
              </label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Describe what students will learn in this course..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Category and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Category *"
                  value={selectedCategoryId}
                  onChange={(value) => setValue('categoryId', value)}
                  options={categoryOptions}
                  placeholder="Select category"
                />
                {errors.categoryId && (
                  <p className="text-xs text-red-600 mt-1">{errors.categoryId.message}</p>
                )}
              </div>

              <Select
                label="Difficulty Level *"
                value={selectedLevel}
                onChange={(value) => setValue('level', value)}
                options={levelOptions}
              />
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (Naira) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="0.00"
                  error={errors.price?.message}
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 for free course</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Duration
                </label>
                <Input
                  {...register('duration')}
                  placeholder="e.g., 10 hours"
                />
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Language
              </label>
              <Input
                {...register('language')}
                placeholder="English"
              />
            </div>
          </div>
        </div>

        {/* Course Thumbnail */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Thumbnail</h2>

          <div className="space-y-4">
            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>

          <div className="space-y-4">
            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Prerequisites/Requirements
              </label>
              <textarea
                {...register('requirements')}
                rows={4}
                placeholder="List any prerequisites or requirements for this course (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            {/* What You Will Learn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                What Students Will Learn
              </label>
              <textarea
                {...register('whatYouWillLearn')}
                rows={4}
                placeholder="List the key learning outcomes (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/my-courses')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;
