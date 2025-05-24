// Notification types as a plain object
export const NotificationType = {
  REQUEST_RECEIVED: 'REQUEST_RECEIVED',
  REQUEST_ACCEPTED: 'REQUEST_ACCEPTED',
  REQUEST_REJECTED: 'REQUEST_REJECTED',
  GENERAL: 'GENERAL',
};

// Notification status values (you can use constants or just strings)
export const NotificationStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  NULL: null,
};

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} type - One of NotificationType values
 * @property {string} title
 * @property {string} message
 * @property {string} timestamp
 * @property {boolean} read
 * @property {('pending'|'accepted'|'rejected'|null)} status
 */

/**
 * @typedef {Object} FoodItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} image
 * @property {string} owner
 * @property {string} postedAt
 * @property {string} category
 * @property {number} portions
 * @property {boolean} available
 */
