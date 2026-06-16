import { motion } from 'framer-motion'
import { Check, Star, Package, MapPin, Calendar, Clock } from 'lucide-react'
import StatusBadge from './StatusBadge'
import Timeline from './Timeline'

export default function OutgoingRequestCard({
  request,
  userNames = {},
  onArrived,
  onRateExperience
}) {
  const imageUrl =
    request.imageUrl || request.foodImage || request.listing?.imageUrl || 'https://via.placeholder.com/400'
  const title = request.foodName || request.foodTitle || request.listing?.title || 'Requested item'
  const pickupTime = request.pickupTime || request.preferredPickupTime || ''
  const location = request.pickupLocation || request.location || request.listing?.location || 'Unknown'
  const requesterRated =
    request.requesterRated ||
    request.ratingGiven ||
    (request.rating && request.rating.stars != null)
  const ratingStars = request.rating?.stars
  const ownerName =
    request.ownerName ||
    request.owner ||
    request.listing?.owner ||
    userNames[request.ownerId] ||
    'Owner'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white border border-primary border-opacity-20 rounded-xl p-4 shadow-soft hover:shadow-medium transition-all"
    >
      <div className="flex gap-4">
        <div
          className="w-20 h-20 bg-cover bg-center rounded-lg flex-shrink-0"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-text">{title}</h3>
              <p className="text-gray-600 text-sm">From: {ownerName}</p>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <Timeline currentStatus={request.status} timeline={request.timeline} />

          <div className="flex gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{request.pickupDate || 'No date'}</span>
            </div>
            {pickupTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{pickupTime}</span>
              </div>
            )}
          </div>

          {request.status === 'accepted' && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              <p className="font-medium">Request Accepted!</p>
              <p className="text-sm mt-1">
                You can pick up the food at the scheduled time.
              </p>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {request.status === 'ready_for_pickup' && (
              <button
                onClick={() => onArrived && onArrived(request.id)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 transition-colors"
              >
                <Package className="w-4 h-4" />
                Arrived at Location
              </button>
            )}

            {request.status === 'arrived' && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
                <p className="font-medium">Arrived at pickup</p>
                <p className="text-sm mt-1">
                  Waiting for the owner to confirm completion.
                </p>
              </div>
            )}

            {request.status === 'completed' && !requesterRated && (
              <button
                onClick={() => onRateExperience && onRateExperience(request)}
                className="inline-flex items-center gap-2 rounded-lg border border-primary text-primary px-4 py-3 hover:bg-primary hover:text-white transition-colors"
              >
                <Star className="w-4 h-4" />
                Rate Experience
              </button>
            )}

            {request.status === 'completed' && requesterRated && (
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 cursor-not-allowed"
              >
                <Star className="w-4 h-4 text-amber-500" />
                Rated {ratingStars || ''}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}