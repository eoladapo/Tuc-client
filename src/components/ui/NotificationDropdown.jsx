import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiBell, HiX, HiCheck, HiAcademicCap, HiCurrencyDollar, HiStar } from 'react-icons/hi';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications and unread count
  const { data: notificationsData, isLoading } = useNotifications({ limit: 10 });
  const { data: unreadData } = useUnreadCount();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = unreadData?.data?.count || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Close dropdown
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'course':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <HiAcademicCap className="w-4 h-4 text-blue-600" />
          </div>
        );
      case 'payment':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <HiCurrencyDollar className="w-4 h-4 text-green-600" />
          </div>
        );
      case 'achievement':
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <HiStar className="w-4 h-4 text-yellow-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <HiBell className="w-4 h-4 text-slate-600" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <HiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-[32rem] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <HiCheck className="w-3 h-3" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-50 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 bg-slate-200 rounded" />
                      <div className="h-2 w-1/2 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <HiBell className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600">No notifications yet</p>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => {
                  const hasActionUrl = notification.actionUrl && notification.actionUrl.trim() !== '';
                  const NotificationWrapper = hasActionUrl ? Link : 'div';
                  const wrapperProps = hasActionUrl
                    ? { to: notification.actionUrl }
                    : {};

                  return (
                    <NotificationWrapper
                      key={notification.id}
                      {...wrapperProps}
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex gap-3 p-3 rounded-lg transition-colors ${hasActionUrl ? 'cursor-pointer' : 'cursor-default'} ${!notification.isRead
                        ? 'bg-primary-50 hover:bg-primary-100'
                        : 'hover:bg-slate-50'
                        }`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-600" />
                        </div>
                      )}
                    </NotificationWrapper>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-200">
              <Link
                to="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
