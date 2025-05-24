import { useState } from 'react'
import { motion } from 'framer-motion'

function NotificationItem({ notification, icon, formattedDate, markAsRead }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    // Navigate or expand notification details here
  }
  
  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`px-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer ${
        notification.isRead ? 'bg-white' : 'bg-primary-50'
      } ${isHovered ? 'bg-gray-50' : ''} transition-colors duration-200`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="flex-shrink-0 h-2 w-2 rounded-full bg-secondary-500"></span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default NotificationItem