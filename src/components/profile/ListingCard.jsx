import { Edit3, Trash2, MapPin, Calendar, Clock, Star } from 'lucide-react'

export default function ListingCard({ listing, onEdit, onDelete, loading }) {
  const imageUrl = listing.imageUrl || listing.image || 'https://via.placeholder.com/800x600'
  const title = listing.foodName || listing.title || 'Untitled Listing'
  const pickupTime =
    listing.pickupTime ||
    (listing.availabilityStartTime && listing.availabilityEndTime
      ? `${listing.availabilityStartTime} - ${listing.availabilityEndTime}`
      : '')
  const ratingValue = listing.ownerAverageRating || listing.averageRating || listing.rating?.stars
  const ratingCount = listing.ownerTotalRatings || listing.totalRatings
  const ownerName = listing.ownerName || 'Owner'

  return (
    <article className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-all">
      <div
        className="h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-text mb-3">{title}</h3>

        {ratingValue && ratingCount ? (
          <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Shared by {ownerName} ⭐ {Number(ratingValue).toFixed(1)} ({ratingCount} ratings)
          </p>
        ) : (
          <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-slate-400" />
            Shared by {ownerName} • No ratings yet
          </p>
        )}

        <p className="text-gray-600 text-base mb-4">{listing.description}</p>

        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5" />
            <span>{listing.pickupLocation || listing.location || 'Unknown location'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            <span>{listing.pickupDate || listing.date || 'No date'}</span>
          </div>
          {pickupTime && (
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" />
              <span>{pickupTime}</span>
            </div>
          )}
          {listing.expiryDate && (
            <div className="text-sm text-slate-500">⏳ Best before {listing.expiryDate}</div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-primary bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:opacity-50"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}