import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Check,
  MessageCircle,
  Package,
  Calendar,
  Clock,
  MapPin,
  Send
} from 'lucide-react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import Timeline from './Timeline'
import StatusBadge from './StatusBadge'

export default function RequestDetailsModal({
  open,
  request,
  userNames = {},
  onClose,
  onStatusUpdate,
  isOwner = false
}) {
  const [currentRequest, setCurrentRequest] = useState(request)
  const [showMessageBox, setShowMessageBox] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    if (!open || !request?.id) return

    setCurrentRequest(request)
    setShowMessageBox(false)
    setMessageText('')

    const unsubscribe = onSnapshot(
      doc(db, 'requests', request.id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setCurrentRequest({ id: docSnapshot.id, ...docSnapshot.data() })
        }
      },
      (error) => {
        console.error('Error listening to request updates:', error)
      }
    )

    return () => unsubscribe()
  }, [open, request?.id])

  if (!open || !currentRequest) return null

  const imageUrl =
    currentRequest.imageUrl ||
    currentRequest.foodImage ||
    currentRequest.listing?.imageUrl ||
    currentRequest.listing?.image ||
    'https://via.placeholder.com/800x600'

  const title =
    currentRequest.foodName ||
    currentRequest.foodTitle ||
    currentRequest.listing?.title ||
    'Requested item'

  const pickupTime =
    currentRequest.preferredPickupTime ||
    currentRequest.pickupTime ||
    ''

  const pickupLocation =
    currentRequest.pickupLocation ||
    currentRequest.location ||
    currentRequest.listing?.location ||
    'Unknown'

  const requesterMessage =
    currentRequest.requesterMessage ||
    currentRequest.message ||
    'No message provided'

  const ownerReply = currentRequest.ownerReply || ''

  const requesterName =
    currentRequest.requesterName ||
    userNames[currentRequest.requesterId] ||
    'Guest'

  const handleUpdate = (status) => {
    onStatusUpdate(currentRequest.id, status, '')
    onClose()
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) return

    setSendingMessage(true)
    try {
      const requestRef = doc(db, 'requests', currentRequest.id)
      await updateDoc(requestRef, {
        ownerReply: messageText,
        updatedAt: new Date().toISOString()
      })
      setMessageText('')
      setShowMessageBox(false)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[24px] max-w-lg w-full shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-text">Request Details</h2>
              <button
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <div
                  className="w-20 h-20 bg-cover bg-center rounded-lg flex-shrink-0"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                  onError={(e) => {
                    e.target.style.backgroundImage = 'url(https://via.placeholder.com/200)'
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text">{title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Requested by: {requesterName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={currentRequest.status} />
                  </div>
                </div>
              </div>

              <div className="mt-3 overflow-hidden">
                <Timeline
                  currentStatus={currentRequest.status}
                  timeline={currentRequest.timeline}
                  compact
                />
              </div>
            </div>

            <div className="mb-4 rounded-lg bg-slate-100 p-4">
              <h4 className="text-sm font-semibold text-text mb-2">Pickup Details</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{currentRequest.pickupDate || 'No date'}</span>
                </div>
                {pickupTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{pickupTime}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{pickupLocation}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 rounded-lg bg-blue-50 p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Message from Requester</h4>
              <p className="text-sm text-gray-700">"{requesterMessage}"</p>
            </div>

            {ownerReply && (
              <div className="mb-4 rounded-lg bg-green-50 p-4">
                <h4 className="text-sm font-semibold text-green-900 mb-2">Your Message</h4>
                <p className="text-sm text-gray-700">"{ownerReply}"</p>
              </div>
            )}

            {showMessageBox && currentRequest.status === 'accepted' && (
              <div className="mb-4 rounded-lg border-2 border-sky-300 bg-sky-50 p-4">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  rows="3"
                  className="w-full rounded-lg border border-sky-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:border-sky-500"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-[16px] bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    onClick={() => {
                      setShowMessageBox(false)
                      setMessageText('')
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-[16px] border-2 border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="space-y-3">
                {currentRequest.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleUpdate('accepted')}
                      className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdate('declined')}
                      className="inline-flex items-center justify-center gap-2 rounded-[20px] border-2 border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                )}

                {currentRequest.status === 'accepted' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowMessageBox(!showMessageBox)}
                      className="inline-flex items-center justify-center gap-2 rounded-[20px] border-2 border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button
                      onClick={() => handleUpdate('ready_for_pickup')}
                      className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                    >
                      <Package className="w-4 h-4" />
                      Mark Ready
                    </button>
                  </div>
                )}

                {(currentRequest.status === 'ready_for_pickup' ||
                  currentRequest.status === 'arrived') && (
                  <button
                    onClick={() => handleUpdate('completed')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[20px] bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                  >
                    <Check className="w-4 h-4" />
                    Mark Completed
                  </button>
                )}

                {currentRequest.status === 'completed' && (
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[20px] border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Check className="w-4 h-4" />
                    View Rating
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}