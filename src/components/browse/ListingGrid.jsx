import React from 'react'
import ListingCard from './ListingCard'

export default function ListingGrid({ listings, user, onRequest, onView, requestStatusByPost }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          user={user}
          requestStatus={requestStatusByPost.get(listing.id)}
          onRequest={onRequest}
          onView={onView}
        />
      ))}
    </div>
  )
}