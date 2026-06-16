import { useState, useEffect, useMemo } from 'react'

export const useNotifications = (incomingRequests = [], outgoingRequests = []) => {
  const [readState, setReadState] = useState(() => {
    if (typeof window === 'undefined') return {}
    try {
      return JSON.parse(localStorage.getItem('plateMateNotificationsRead') || '{}')
    } catch {
      return {}
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('plateMateNotificationsRead', JSON.stringify(readState))
    }
  }, [readState])

  const buildNotification = (request, isIncoming) => {
    const id = `${isIncoming ? 'in' : 'out'}-${request.id}`
    const timestamp = request.updatedAt || request.createdAt || new Date().toISOString()
    let title = ''
    let message = ''
    let type = 'general'

    if (isIncoming) {
      if (request.status === 'pending') {
        type = 'request'
        title = `New request from ${request.requesterName || 'someone'}`
        message = `${request.requesterName || 'Someone'} wants ${request.foodName || 'your item'}`
      } else if (request.status === 'accepted') {
        type = 'accepted'
        title = `Request accepted`
        message = `You accepted the request for ${request.foodName}`
      } else if (request.status === 'ready_for_pickup') {
        type = 'ready'
        title = `Ready for pickup`
        message = `${request.foodName} is ready for pickup`
      } else if (request.status === 'arrived') {
        type = 'arrived'
        title = `Requester arrived`
        message = `${request.requesterName || 'Your requester'} has arrived for pickup`
      } else if (request.status === 'completed') {
        type = 'completed'
        title = `Request completed`
        message = `Pickup finished for ${request.foodName}`
      } else if (request.status === 'declined') {
        type = 'rejected'
        title = `Request declined`
        message = `You declined the request for ${request.foodName}`
      }
    } else {
      if (request.status === 'pending') {
        type = 'request'
        title = `Request sent`
        message = `Your request for ${request.foodName} is pending`
      } else if (request.status === 'accepted') {
        type = 'accepted'
        title = `Request accepted`
        message = `${request.foodName} request was accepted`
      } else if (request.status === 'ready_for_pickup') {
        type = 'ready'
        title = `Ready for pickup`
        message = `Owner marked ${request.foodName} ready`
      } else if (request.status === 'arrived') {
        type = 'arrived'
        title = `Arrived at pickup`
        message = `You arrived at pickup location for ${request.foodName}`
      } else if (request.status === 'completed') {
        type = 'completed'
        title = `Pickup completed`
        message = `Your pickup is complete! Rate your experience.`
      } else if (request.status === 'declined') {
        type = 'rejected'
        title = `Request declined`
        message = `Your request for ${request.foodName} was declined`
      }
    }

    return {
      id,
      type,
      title,
      message,
      timestamp,
      createdAt: timestamp,
      isRead: !!readState[id],
      request
    }
  }

  const notifications = useMemo(() => {
    const items = [
      ...incomingRequests.map((request) => buildNotification(request, true)),
      ...outgoingRequests.map((request) => buildNotification(request, false))
    ]

    return items
      .filter((item) => item.title)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [incomingRequests, outgoingRequests, readState])

  const hasUnread = notifications.some((notification) => !notification.isRead)

  const markAllAsRead = () => {
    const nextState = notifications.reduce((acc, notification) => {
      acc[notification.id] = true
      return acc
    }, {})
    setReadState((prev) => ({ ...prev, ...nextState }))
  }

  const markAsRead = (id) => {
    setReadState((prev) => ({ ...prev, [id]: true }))
  }

  return {
    notifications,
    hasUnread,
    markAllAsRead,
    markAsRead
  }
}