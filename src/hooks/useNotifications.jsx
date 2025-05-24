import { useState, useEffect } from 'react';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    type: 'REQUEST_RECEIVED',
    title: 'New Request for Homemade Pasta',
    message: 'Sarah would like to claim your homemade pasta dish',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    read: false,
    status: 'pending'
  },
  {
    id: '2',
    type: 'REQUEST_ACCEPTED',
    title: 'Request Accepted',
    message: 'Michael accepted your request for vegetable curry',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    read: false,
    status: 'accepted'
  },
  {
    id: '3',
    type: 'REQUEST_REJECTED',
    title: 'Request Declined',
    message: 'John cannot fulfill your request for chocolate cake',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
    read: true,
    status: 'rejected'
  },
  {
    id: '4',
    type: 'GENERAL',
    title: 'Welcome to PlateMate!',
    message: 'Start sharing your homemade dishes with your community today',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
    read: true,
    status: null
  },
  {
    id: '5',
    type: 'REQUEST_RECEIVED',
    title: 'New Request for Apple Pie',
    message: 'David would like to claim your freshly baked apple pie',
    timestamp: new Date(Date.now() - 26 * 3600000).toISOString(), // 26 hours ago
    read: true,
    status: 'pending'
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Check if there are any unread notifications
    const unreadExists = notifications.some(notification => !notification.read);
    setHasUnread(unreadExists);
  }, [notifications]);

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };

  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return {
    notifications,
    hasUnread,
    markAllAsRead,
    markAsRead
  };
};
