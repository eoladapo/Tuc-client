import { useState, useEffect } from 'react';
import { HiUser, HiLockClosed, HiBell, HiCreditCard } from 'react-icons/hi';
import { PageHeader } from '../../components/dashboard';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import axios from 'axios';
import { authAPI } from '../../api/auth.api';

const SettingsPage = () => {
  const { user, updateUser, refreshProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
  });

  // Update avatarUrl when user changes (after refresh)
  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarUrl(user.avatarUrl);
    }
  }, [user?.avatarUrl]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiUser },
    { id: 'password', label: 'Password', icon: HiLockClosed },
    { id: 'notifications', label: 'Notifications', icon: HiBell },
    { id: 'billing', label: 'Billing', icon: HiCreditCard },
  ];

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingAvatar(true);
    toast.loading('Uploading avatar...', { id: 'avatar-upload' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'tuc-academy/avatars');

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      setAvatarUrl(response.data.secure_url);
      toast.success('Avatar uploaded successfully!', { id: 'avatar-upload' });

      // Update profile with new avatar URL
      try {
        await authAPI.updateProfile({ avatarUrl: response.data.secure_url });
        await refreshProfile();
      } catch (error) {
        toast.error('Failed to save avatar to profile');
      }
    } catch (error) {
      toast.error('Failed to upload avatar', { id: 'avatar-upload' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        ...formData,
        ...(avatarUrl && { avatarUrl })
      };

      await authAPI.updateProfile(updateData);
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary-600' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h3>

                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
                    <div className="relative">
                      {(avatarUrl || user?.avatarUrl) ? (
                        <img
                          src={avatarUrl || user?.avatarUrl}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                          {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
                        </div>
                      )}
                      {uploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className={`inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium cursor-pointer ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                      </label>
                      <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF (max 2MB)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    value={user?.email}
                    placeholder="you@example.com"
                    className="mt-4"
                    disabled
                    helperText="Email cannot be changed"
                  />

                  <Input
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="mt-4"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                  <Button type="submit" isLoading={isLoading}>
                    Save Changes
                  </Button>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                  <Button type="submit" isLoading={isLoading}>
                    Update Password
                  </Button>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>

                  <div className="space-y-4">
                    {[
                      { label: 'Email Notifications', description: 'Receive email about your account activity' },
                      { label: 'Course Updates', description: 'Get notified about new lessons and content' },
                      { label: 'Marketing Emails', description: 'Receive tips, guides, and promotional content' },
                      { label: 'Weekly Summary', description: 'Get a weekly summary of your learning progress' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-primary-200 hover:bg-primary-50/50 transition-all">
                        <div>
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                  <Button type="button" onClick={handleSubmit} isLoading={isLoading}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing Information</h3>

                  <div className="p-6 rounded-lg border-2 border-dashed border-slate-200 text-center">
                    <HiCreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No payment methods saved</p>
                    <Button type="button">
                      Add Payment Method
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-4">Billing History</h4>
                  <p className="text-sm text-slate-500">No transactions yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
