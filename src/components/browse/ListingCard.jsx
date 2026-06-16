import React from 'react'
import { motion } from 'framer-motion'
import { parseDate, formatTimeRemaining, getUrgency, isExpired } from '../../utils/browseHelpers'

export default function ListingCard({ listing, user, onRequest, onView, requestStatus }) {
  const isOwner = listing.userId === user?.uid
  const expiryDate = parseDate(listing.expiryDate)
  const expired = isExpired(listing.expiryDate)
  const urgency = getUrgency(listing.expiryDate)
  const countdownLabel = expiryDate ? formatTimeRemaining(listing.expiryDate) : ''

  const hasRequested = Boolean(requestStatus)
  const buttonText = hasRequested
    ? requestStatus === 'pending'
      ? 'Request Pending'
      : requestStatus === 'accepted'
      ? 'Request Accepted'
      : requestStatus === 'completed'
      ? 'Completed'
      : 'Already Requested'
    : 'Request This Food'

  const buttonDisabled = isOwner || hasRequested || expired || listing.isAvailable === false

  const buttonClass = buttonDisabled
    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
    : 'bg-green-500 hover:bg-green-600 text-white'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl overflow-hidden shadow-medium transition-all ${expired ? 'opacity-60' : ''}`}
    >
      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url(${listing.imageUrl || 'https://via.placeholder.com/400'})`
        }}
      />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl font-semibold mb-2">{listing.foodName}</h3>
            <p className="text-sm text-slate-500 mb-2">📍 {listing.pickupLocation}</p>

            {(listing.ownerName || listing.ownerRating != null) && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-3">
                {listing.ownerName && <span>By {listing.ownerName}</span>}
                {listing.ownerRating != null && (
                  <span>• ⭐ {Number(listing.ownerRating).toFixed(1)}</span>
                )}
              </div>
            )}
          </div>

          {urgency && !expired && (
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                urgency === 'lastCall'
                  ? 'bg-amber-100 text-amber-900 animate-pulse'
                  : 'bg-orange-100 text-orange-900'
              }`}
            >
              {urgency === 'lastCall' ? 'Last Call' : 'Expires Today'}
            </div>
          )}
        </div>

        {expiryDate && !expired && (
          <p className="text-sm text-slate-600 mb-4">{countdownLabel}</p>
        )}

        <p className="mb-4 text-gray-600">{listing.description}</p>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => onView(listing.id)}
            className="text-green-600 font-medium hover:text-green-700"
          >
            View Details
          </button>

          {isOwner ? (
            <span className="text-gray-500 font-medium">Your Listing</span>
          ) : (
            <button
              onClick={() => onRequest(listing)}
              disabled={buttonDisabled}
              className={`px-5 py-3 rounded-lg text-base font-semibold border ${buttonClass} border-transparent transition`}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}