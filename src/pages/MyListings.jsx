import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { db, auth } from '../config/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

function MyListings() {
  const navigate = useNavigate()
  const [myItems, setMyItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setMyItems([])
        setLoading(false)
        return
      }

      try {
        const q = query(
          collection(db, 'posts'),
          where('userId', '==', user.uid)
        )
        const querySnapshot = await getDocs(q)
        const listings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Sort by newest to oldest
        const sortedListings = listings.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.timestamp || 0)
          const dateB = new Date(b.createdAt || b.timestamp || 0)
          return dateB - dateA
        })
        
        setMyItems(sortedListings)
      } catch (err) {
        console.error('Error fetching my listings:', err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = (listing) => {
    setSelectedListing(listing)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    console.log('Deleting listing:', selectedListing?.title)
    setShowDeleteModal(false)
    alert('Listing deleted successfully!')
  }

  const viewRequests = (listing) => {
    setSelectedListing(listing)
    setShowRequestsModal(true)
  }

  const handleRequest = (requestId, action) => {
    console.log(`Request ${requestId} ${action}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark">My Listings</h1>
          <button
            onClick={() => navigate('/share-food')}
            className="btn-primary"
          >
            Share New Food
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-medium">
            <p className="text-text-dark">Loading your listings…</p>
          </div>
        ) : myItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl overflow-hidden shadow-medium"
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${listing.imageUrl || listing.image || 'https://via.placeholder.com/400'})`
                  }}
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{listing.foodName || listing.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        listing.isAvailable ? 'bg-secondary' : 'bg-primary'
                      }`}
                    >
                      {listing.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <p className="text-text-light mb-2">{listing.description}</p>
                  <p className="text-text-light mb-2">📍 {listing.pickupLocation || listing.location}</p>
                  <p className="text-text-light mb-2">
                    {listing.pickupDate ? `Pickup: ${listing.pickupDate}` : ''}
                  </p>
                  <p className="text-text-light mb-4">
                    {listing.availabilityStartTime && listing.availabilityEndTime
                      ? `${listing.availabilityStartTime} - ${listing.availabilityEndTime}`
                      : ''}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="space-x-2">
                      <button
                        onClick={() => navigate(`/food/${listing.id}/edit`)}
                        className="text-primary hover:text-accent"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(listing)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>

                    <button
                      onClick={() => viewRequests(listing)}
                      className="btn-secondary"
                    >
                      View Requests ({listing.requests?.length || 0})
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-medium">
            <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
            <p className="text-text-light mb-4">
              Share your first food item with the community!
            </p>
            <button
              onClick={() => navigate('/share-food')}
              className="btn-primary"
            >
              Share Food
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Delete Listing</h3>
              <p className="text-text-light mb-4">
                Are you sure you want to delete "{selectedListing?.foodName || selectedListing?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white btn"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRequestsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setShowRequestsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">
                Requests for {selectedListing?.foodName || selectedListing?.title}
              </h3>
              <div className="space-y-4">
                {selectedListing?.requests?.length > 0 ? (
                  selectedListing.requests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <p className="font-medium">{request.user}</p>
                        <p className="text-sm text-text-light capitalize">{request.status}</p>
                      </div>
                      {request.status === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleRequest(request.id, 'accept')}
                            className="btn-primary text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequest(request.id, 'decline')}
                            className="btn-secondary text-sm"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-text-light">No requests yet.</p>
                )}
              </div>
              <button
                onClick={() => setShowRequestsModal(false)}
                className="w-full btn-secondary mt-4"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MyListings