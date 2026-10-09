import api from './axios.config';

export const notificationsAPI = {
  // Get user's notifications
  getMyNotifications: (params) => {
    return api.get('/notifications', { params });
  },

  // Get unread count
  getUnreadCount: () => {
    return api.get('/notifications/unread/count');
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    return api.patch(`/notifications/${notificationId}/read`);
  },

  // Mark all as read
  markAllAsRead: () => {
    return api.patch('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: (notificationId) => {
    return api.delete(`/notifications/${notificationId}`);
  },
};
