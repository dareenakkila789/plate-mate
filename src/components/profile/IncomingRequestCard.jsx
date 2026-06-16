  import { motion } from 'framer-motion'
  import { Check, X, MessageCircle, Package, Calendar, Clock, User } from 'lucide-react'
  import StatusBadge from './StatusBadge'
  
  export default function IncomingRequestCard({
    request,
    userNames,
    onClick,
    onRespond,
    actionLoading
  }) {
    const requesterName = request.requesterName || userNames[request.requesterId] || 'Guest'
    const foodName = request.foodName || request.foodTitle || 'Food item'
    const pickupTime = request.preferredPickupTime || request.pickupTime || 'No time specified'
    const pickupDate = request.pickupDate || 'No date'
    const messagePreview = request.requesterMessage || request.message || 'No message provided'
    const initials = requesterName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  
    const handleCardClick = () => {
      if (onClick) onClick()
    }
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleCardClick()
          }
        }}
        role="button"
        tabIndex={0}
        className="bg-white border border-primary border-opacity-20 rounded-xl p-4 shadow-soft hover:shadow-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
              {requesterName ? initials : <User className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">{requesterName}</h3>
              <p className="text-sm text-gray-600">Requested: {foodName}</p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>
  
        <p className="text-gray-700 mb-4">"{messagePreview}"</p>
  
        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{pickupDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{pickupTime}</span>
          </div>
        </div>
  
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onClick()
            }}
            className="inline-flex min-w-[180px] items-center justify-center gap-3 rounded-[28px] border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <MessageCircle className="w-5 h-5" />
            View Details
          </button>
  
          {request.status === 'pending' && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onRespond(request.id, 'accepted')
                }}
                disabled={actionLoading}
                className="inline-flex min-w-[180px] items-center justify-center gap-3 rounded-[28px] bg-yellow-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-yellow-600 disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                Accept
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onRespond(request.id, 'declined')
                }}
                disabled={actionLoading}
                className="inline-flex min-w-[180px] items-center justify-center gap-3 rounded-[28px] border border-red-300 bg-white px-6 py-4 text-base font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                Decline
              </button>
            </>
          )}
  
          {request.status === 'accepted' && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onRespond(request.id, 'ready_for_pickup')
              }}
              disabled={actionLoading}
              className="inline-flex min-w-[180px] items-center justify-center gap-3 rounded-[28px] bg-sky-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              <Package className="w-5 h-5" />
              Mark Ready for Pickup
            </button>
          )}
  
          {request.status === 'arrived' && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onRespond(request.id, 'completed')
              }}
              disabled={actionLoading}
              className="inline-flex min-w-[180px] items-center justify-center gap-3 rounded-[28px] bg-green-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
              Mark Completed
            </button>
          )}
  
          {request.status === 'completed' && (
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex min-w-[180px] items-center justify-center gap-3 rounded-[28px] border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Check className="w-5 h-5" />
              View Rating
            </button>
          )}
        </div>
      </motion.div>
    )
  }