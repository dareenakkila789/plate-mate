import { motion } from 'framer-motion'
import { format, isToday, isYesterday } from 'date-fns'
import { 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline, 
  IoFastFoodOutline,
  IoTimeOutline
} from 'react-icons/io5'
import NotificationItem from './NotificationItem'
import EmptyState from '../ui/EmptyState'

function NotificationPanel({ notifications, markAsRead, markAllAsRead }) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request':
        return <IoFastFoodOutline className="text-secondary-500" size={28} />; // larger icon
      case 'accepted':
        return <IoCheckmarkCircleOutline className="text-success-500" size={28} />;
      case 'rejected':
        return <IoCloseCircleOutline className="text-error-500" size={28} />;
      default:
        return <IoTimeOutline className="text-gray-500" size={28} />;
    }
  };
  
  const formatDate = (date) => {
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };
  
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-[480px] max-w-full text-lg" // wider and larger font
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 text-xl font-bold">
        <h3 className="font-semibold text-gray-800 text-2xl">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-base text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="max-h-[32rem] overflow-y-auto py-4 px-2">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              icon={getNotificationIcon(notification.type)}
              formattedDate={formatDate(notification.createdAt)}
              markAsRead={markAsRead}
              // You can also pass a larger font size prop if needed
            />
          ))
        ) : (
          <EmptyState 
            icon={<IoFastFoodOutline size={40} className="text-gray-400" />}
            title="No notifications"
            message="You're all caught up! Check back later for updates on your shared food items."
          />
        )}
      </div>
      
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        <a href="/notifications" className="block text-center text-base text-primary-600 hover:text-primary-700 font-medium">
          View all notifications
        </a>
      </div>
    </motion.div>
  )
}

export default NotificationPanel