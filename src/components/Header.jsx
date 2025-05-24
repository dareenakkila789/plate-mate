import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Home, Menu, X, UtensilsCrossed, User } from 'lucide-react';
import NotificationPanel from './notifiactions/NotificationPanel';
import { auth } from '../config/firebase';
import { Search } from 'lucide-react'; // Add this import at the top with other lucide-react icons

import { 
  IoNotificationsOutline, 
  IoMenuOutline, 
  IoCloseOutline, 
  IoPersonOutline,
  IoSearchOutline 
} from 'react-icons/io5'
function Header({ user, notifications = [], markAsRead, markAllAsRead }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const notificationRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(notification => !notification.isRead).length
  
  // Handle clicks outside notification panel
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowMobileMenu(false)
  }
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
    setShowNotifications(false)
  }


  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm w-full">
      <div className="flex justify-between items-center h-24 px-10"> {/* Full width with side padding */}
        {/* Logo aligned left */}
        <Link to="/" className="flex items-center gap-4 text-4xl font-extrabold text-green-600">
          <UtensilsCrossed className="w-12 h-12" />
          PlateMate
        </Link>

        {/* Desktop nav aligned right */}
        <nav className="hidden md:flex space-x-16 items-center text-xl font-semibold">
          <Link
            to="/"
            className="flex items-center text-gray-700 hover:text-green-500 transition-colors duration-200"
          >
            <Home className="mr-3" size={28} />
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/new-item"
                className="flex items-center text-gray-700 hover:text-green-500 transition-colors duration-200"
              >
                <UtensilsCrossed className="mr-3" size={28} />
                Share Food
              </Link>
              <Link
                to="/browse"
                className="flex items-center text-gray-700 hover:text-green-500 transition-colors duration-200"
              >
                <Search className="mr-3" size={28} />
                Browse
              </Link>
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-green-500 transition-colors duration-200"
              >
                <User className="mr-3" size={28} />
                Profile
              </Link>

              {/* Notification Button */}
            <div className="relative" ref={notificationRef}>
              <button 
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition-colors relative"
                onClick={toggleNotifications}
                aria-label="Notifications"
              >
                {/* Larger icon */}
                <IoNotificationsOutline size={32} />
                {/* Green dot for unread notifications */}
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1 right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                    style={{ zIndex: 2 }}
                  />
                )}
                {/* Optional: keep the unread count badge if you want */}
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>
              
              {/* Notification Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96"
                  >
                    <NotificationPanel 
                      notifications={notifications} 
                      markAsRead={markAsRead} 
                      markAllAsRead={markAllAsRead} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            

              <button
                onClick={handleSignOut}
                className="ml-10 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 hover:text-green-500 transition-colors duration-200 text-xl font-semibold"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-4 rounded-md text-gray-700 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 w-full"
          >
            <div className="flex flex-col space-y-8 py-10 px-10 text-2xl font-semibold">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-500 flex items-center">
                <Home className="mr-5" size={30} />
                Home
              </Link>
              {user ? (
                <>
                  <Link to="/new-item" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-500 flex items-center">
                    <UtensilsCrossed className="mr-5" size={30} />
                    Share Food
                  </Link>
                  <Link to="/browse" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-500 flex items-center">
                    <Search className="mr-5" size={30} />
                    Browse
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-500 flex items-center">
                    <User className="mr-5" size={30} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="text-left text-red-600 hover:text-red-700 text-2xl font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-500 text-2xl font-semibold">
                  Sign In
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
