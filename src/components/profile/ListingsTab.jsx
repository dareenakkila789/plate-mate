import { Package } from 'lucide-react'
import ListingCard from './ListingCard'

export default function ListingsTab({ listings, onEditListing, onDeleteListing, loading }) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text mb-2">No active listings</h3>
        <p className="text-gray-600">Start sharing food with your community!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onEdit={() => onEditListing(listing)}
          onDelete={() => onDeleteListing(listing)}
          loading={loading}
        />
      ))}
    </div>
  )
}