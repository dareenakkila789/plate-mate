import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import { updateDoc, doc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import ProfileInfo from '../components/profile/ProfileInfo'
import ProfileTabs from '../components/profile/ProfileTabs'
import ListingsTab from '../components/profile/ListingsTab'
import RequestsTab from '../components/profile/RequestsTab'
import OutgoingRequestsTab from '../components/profile/OutgoingRequestsTab'
import HistoryTab from '../components/profile/HistoryTab'
import EditListingModal from '../components/profile/EditListingModal'
import DeleteListingModal from '../components/profile/DeleteListingModal'
import RequestDetailsModal from '../components/profile/RequestDetailsModal'
import RatingModal from '../components/profile/RatingModal'
import RelistModal from '../components/profile/RelistModal'
import {
  fetchUserData,
  updateProfile as updateProfileService,
  deleteListing
} from '../services/profileService'
import {
  updateRequestStatus,
  markRequestRated
} from '../services/requestService'

const sortByNewest = (arr) =>
  [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

export default function Profile() {
  const [activeTab, setActiveTab] = useState('active')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [editingListing, setEditingListing] = useState(null)
  const [deletingListing, setDeletingListing] = useState(null)
  const [relistingItem, setRelistingItem] = useState(null)
  const [ratingRequest, setRatingRequest] = useState(null)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [ratingError, setRatingError] = useState('')
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [incomingRequests, setIncomingRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [userNames, setUserNames] = useState({})
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [editedUser, setEditedUser] = useState({})

  const fetchListings = async () => {
    if (!user?.uid) return
    try {
      const listingsQuery = query(collection(db, 'posts'), where('userId', '==', user.uid))
      const listingsSnapshot = await getDocs(listingsQuery)
      const listingsData = listingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setListings(listingsData)
    } catch (err) {
      console.error('Error fetching listings:', err)
    }
  }

  useEffect(() => {
    const unsubscribe = fetchUserData(
      setUser,
      setEditedUser,
      setListings,
      setIncomingRequests,
      setOutgoingRequests,
      setUserNames,
      setLoading
    )
    return unsubscribe
  }, [])

  const handleUpdateProfile = () =>
    updateProfileService(user, editedUser, setUser, setIsEditingProfile, setActionLoading)

  const handleDeleteListing = (listingId) =>
    deleteListing(listingId, listings, setListings, setDeletingListing, setActionLoading)

  const updateRequestInList = (list, updatedRequest) =>
    list.map((request) =>
      request.id === updatedRequest.id ? { ...request, ...updatedRequest } : request
    )

  const handleRequestResponse = async (requestId, status, ownerReply = '') => {
  setActionLoading(true)
  try {
    const updatedRequest = await updateRequestStatus(requestId, status, ownerReply)
    const requestWithId = { id: requestId, ...updatedRequest }

    if (status === 'accepted') {
      // Re-fetch all incoming requests so auto-declined ones reflect correctly
      const snapshot = await getDocs(
        query(collection(db, 'requests'), where('ownerId', '==', user.uid))
      )
      const freshRequests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setIncomingRequests(freshRequests)
    } else {
      setIncomingRequests((prev) => updateRequestInList(prev, requestWithId))
    }

    setOutgoingRequests((prev) => updateRequestInList(prev, requestWithId))
    setSelectedRequest((prev) =>
      prev?.id === requestId ? { ...prev, ...requestWithId } : prev
    )

    await fetchListings()
  } catch (error) {
    console.error('Error updating request status:', error)
  } finally {
    setActionLoading(false)
  }
}

  const handleOpenRatingModal = (request) => {
    setRatingError('')
    setRatingRequest(request)
  }

  const handleCloseRatingModal = () => {
    setRatingRequest(null)
    setRatingError('')
  }

  const handleSubmitRating = async (requestId, stars, comment) => {
    setRatingLoading(true)
    setRatingError('')
    try {
      const updatedRequest = await markRequestRated(requestId, stars, comment)
      const requestWithId = { id: requestId, ...updatedRequest }

      setIncomingRequests((prev) => updateRequestInList(prev, requestWithId))
      setOutgoingRequests((prev) => updateRequestInList(prev, requestWithId))
      setSelectedRequest((prev) =>
        prev?.id === requestId ? { ...prev, ...requestWithId } : prev
      )
    } catch (error) {
      console.error('Error submitting rating:', error)
      setRatingError(error.message || 'Unable to submit rating.')
    } finally {
      setRatingLoading(false)
    }
  }

  const handleRelist = (item) => {
    setRelistingItem(item)
  }

  const handleConfirmRelist = async (newListing) => {
    setActionLoading(true)
    try {
      const now = new Date().toISOString()
      const listingRef = doc(db, 'posts', newListing.id)
      await updateDoc(listingRef, {
        ...newListing,
        status: 'active',
        isAvailable: true,
        createdAt: now,
        updatedAt: now
      })

      setListings((prev) => [
        ...prev,
        {
          id: newListing.id,
          ...newListing,
          status: 'active',
          isAvailable: true,
          createdAt: now,
          updatedAt: now
        }
      ])

      setRelistingItem(null)
      alert('Item relisted successfully!')
    } catch (err) {
      console.error('Error relisting item:', err)
      alert('Failed to relist item. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveEditedListing = async (updatedListing) => {
    setActionLoading(true)
    try {
      await updateDoc(doc(db, 'posts', editingListing.id), updatedListing)
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === editingListing.id ? { ...listing, ...updatedListing } : listing
        )
      )
      setEditingListing(null)
    } catch (err) {
      console.error('Error updating listing:', err)
      alert('Failed to update listing. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <p className="text-center text-xl text-gray-600">Please log in to view your profile.</p>
      </div>
    )
  }

  const sortedListings = sortByNewest(listings)
  const sortedIncoming = sortByNewest(incomingRequests)
  const sortedOutgoing = sortByNewest(outgoingRequests)

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <ProfileInfo
            user={user}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            editedUser={editedUser}
            setEditedUser={setEditedUser}
            handleUpdateProfile={handleUpdateProfile}
            actionLoading={actionLoading}
          />

          <div className="bg-white rounded-[36px] shadow-soft border border-slate-200">
            <ProfileTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              listings={sortedListings}
              incomingRequests={sortedIncoming}
              outgoingRequests={sortedOutgoing}
              user={user}
            />

            <div className="p-10">
              {activeTab === 'active' && (
                <ListingsTab
                  listings={sortedListings.filter(
                    (l) => l.status !== 'completed' && l.status !== 'expired'
                  )}
                  onEditListing={(listing) => setEditingListing(listing)}
                  onDeleteListing={(listing) => setDeletingListing(listing)}
                  loading={actionLoading}
                />
              )}

              {activeTab === 'requests' && (
                <RequestsTab
                  incomingRequests={sortedIncoming.filter(
                    (r) => r.status !== 'declined' && r.status !== 'completed'
                  )}
                  userNames={userNames}
                  onSelectRequest={setSelectedRequest}
                  onRespond={handleRequestResponse}
                  actionLoading={actionLoading}
                />
              )}

              {activeTab === 'outgoing' && (
                <OutgoingRequestsTab
                  outgoingRequests={sortedOutgoing.filter(
(r) => {
  if (r.status === 'declined') return false
  if (r.status === 'completed') {
    // Keep in outgoing tab only if not yet rated
    const rated = r.requesterRated || r.ratingGiven || r.rating?.stars != null
    return !rated
  }
  return true
}                  )}
                  userNames={userNames}
                  onArrived={(requestId) => handleRequestResponse(requestId, 'arrived')}
                  onRateExperience={handleOpenRatingModal}
                />
              )}

              {activeTab === 'history' && (
                <HistoryTab
                  listings={sortedListings}
                  incomingRequests={sortedIncoming}
                  outgoingRequests={sortedOutgoing}
                  userNames={userNames}
                  onRelist={handleRelist}
                  user={user}
                />
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <RequestDetailsModal
        open={!!selectedRequest}
        request={selectedRequest}
        userNames={userNames}
        onClose={() => setSelectedRequest(null)}
        onStatusUpdate={(requestId, status, ownerReply) => {
          handleRequestResponse(requestId, status, ownerReply)
          setSelectedRequest(null)
        }}
        isOwner
      />

      <RatingModal
        open={!!ratingRequest}
        request={ratingRequest}
        onClose={handleCloseRatingModal}
        onSubmit={handleSubmitRating}
        loading={ratingLoading}
      />

      <RelistModal
        open={!!relistingItem}
        item={relistingItem}
        onClose={() => setRelistingItem(null)}
        onConfirm={handleConfirmRelist}
        loading={actionLoading}
      />

      <EditListingModal
        listing={editingListing}
        onClose={() => setEditingListing(null)}
        onSave={handleSaveEditedListing}
        loading={actionLoading}
      />

      <DeleteListingModal
        open={!!deletingListing}
        listing={deletingListing}
        onClose={() => setDeletingListing(null)}
        onConfirm={() => deletingListing && handleDeleteListing(deletingListing.id)}
        loading={actionLoading}
      />
    </div>
  )
}