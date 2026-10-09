import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HiHome, HiAcademicCap, HiUsers, HiChartBar, HiCog,
  HiMenu, HiX, HiLogout
} from 'react-icons/hi';
import Logo from '../ui/Logo';
import NotificationDropdown from '../ui/NotificationDropdown';
import { useAuthStore } from '../../store/authStore';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const role = user?.role;

    if (role === 'admin') {
      return [
        { name: 'Overview', href: '/dashboard', icon: HiHome, shortName: 'Home' },
        { name: 'Users', href: '/dashboard/users', icon: HiUsers, shortName: 'Users' },
        { name: 'Courses', href: '/dashboard/courses', icon: HiAcademicCap, shortName: 'Courses' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: HiChartBar, shortName: 'Stats' },
        { name: 'Settings', href: '/dashboard/settings', icon: HiCog, shortName: 'Settings' },
      ];
    }

    if (role === 'instructor') {
      return [
        { name: 'Overview', href: '/dashboard', icon: HiHome, shortName: 'Home' },
        { name: 'My Courses', href: '/dashboard/my-courses', icon: HiAcademicCap, shortName: 'Courses' },
        { name: 'Students', href: '/dashboard/students', icon: HiUsers, shortName: 'Students' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: HiChartBar, shortName: 'Stats' },
        { name: 'Settings', href: '/dashboard/settings', icon: HiCog, shortName: 'Settings' },
      ];
    }

    // Student
    return [
      { name: 'Browse Courses', href: '/dashboard/browse', icon: HiAcademicCap, shortName: 'Browse' },
      { name: 'Overview', href: '/dashboard', icon: HiHome, shortName: 'Home' },
      { name: 'My Learning', href: '/dashboard/my-learning', icon: HiChartBar, shortName: 'Learning' },
      { name: 'Settings', href: '/dashboard/settings', icon: HiCog, shortName: 'Settings' },
    ];
  };

  const navItems = getNavItems();

  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
            <Logo size="default" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-500 hover:text-slate-700"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <HiLogout className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 pb-20 lg:pb-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            {/* Mobile: Logo only, Desktop: Hamburger */}
            <div className="flex items-center gap-3">
              {/* Show hamburger only on desktop when sidebar can be toggled */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden lg:block text-slate-500 hover:text-slate-700"
              >
                <HiMenu className="w-6 h-6" />
              </button>
              {/* Show logo on mobile */}
              <div className="lg:hidden">
                <Logo size="tiny" />
              </div>
            </div>

            {/* Right side: Search (desktop) and Notification */}
            <div className="flex items-center gap-4">
              {/* Search bar - Desktop only */}
              <div className="hidden lg:block max-w-md">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Notifications - Always visible, aligned to right */}
              <NotificationDropdown />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Modern Design */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-slate-200/50 safe-area-bottom shadow-lg">
        <div className="grid grid-cols-4 h-16 px-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className="relative flex flex-col items-center justify-center gap-1 group"
              >
                {/* Hover/Press effect - Scale up */}
                <div className={`relative transition-all duration-200 ease-out
                  ${active ? 'scale-100' : 'scale-95 group-hover:scale-110 group-active:scale-95'}
                `}>
                  {/* Background glow on hover */}
                  <div className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300
                    ${active
                      ? 'bg-primary-400/30 opacity-100'
                      : 'bg-primary-400/0 opacity-0 group-hover:opacity-100 group-hover:bg-primary-400/20'
                    }`}
                  />

                  {/* Icon container with background */}
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200
                    ${active
                      ? 'bg-primary-500 shadow-lg shadow-primary-500/40'
                      : 'bg-transparent group-hover:bg-slate-100 group-active:bg-slate-200'
                    }`}
                  >
                    <Icon
                      className={`transition-all duration-200 ${active
                          ? 'w-6 h-6 text-white'
                          : 'w-5 h-5 text-slate-500 group-hover:text-primary-600'
                        }`}
                    />
                  </div>
                </div>

                {/* Label */}
                <span className={`text-[10px] font-medium transition-all duration-200 ${active
                    ? 'text-primary-600 scale-100'
                    : 'text-slate-500 scale-95 group-hover:text-primary-600 group-hover:scale-100'
                  }`}>
                  {item.shortName}
                </span>

                {/* Active indicator dot */}
                {active && (
                  <div className="absolute bottom-0 w-1 h-1 rounded-full bg-primary-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
