import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  writeBatch
} from 'firebase/firestore'
import { db } from '../config/firebase'

export const createRequest = async (listing, user, requestPickupTime, requestMessage) => {
  if (!listing || !user || !requestPickupTime) throw new Error('Missing required fields')

  if (listing.userId === user.uid) throw new Error('Cannot request your own item')
  if (!listing.isAvailable) throw new Error('Item is no longer available')
  if (listing.expiryDate) {
  const endOfDay = new Date(listing.expiryDate)
  endOfDay.setHours(23, 59, 59, 999)
  if (endOfDay < new Date()) throw new Error('This item has expired and cannot be requested')
}

  const requestsRef = collection(db, 'requests')
  const existingRequestQuery = query(
    requestsRef,
    where('postId', '==', listing.id),
    where('requesterId', '==', user.uid)
  )
  const existingRequests = await getDocs(existingRequestQuery)
  if (!existingRequests.empty) throw new Error('You have already requested this item')

  const now = new Date().toISOString()

  await addDoc(requestsRef, {
    postId: listing.id,
    ownerId: listing.userId,
    requesterId: user.uid,
    foodName: listing.foodName,
    imageUrl: listing.imageUrl,
    pickupLocation: listing.pickupLocation,
    pickupDate: listing.pickupDate,
    requesterMessage: requestMessage,
    ownerReply: '',
    preferredPickupTime: requestPickupTime,
    status: 'pending',
    timeline: [
      {
        status: 'pending',
        createdAt: now
      }
    ],
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    ratingGiven: false,
    requesterRated: false
  })
}

export const fetchRequestsByRequester = async (requesterId) => {
  const requestsRef = collection(db, 'requests')
  const requestsQuery = query(requestsRef, where('requesterId', '==', requesterId))
  const snapshot = await getDocs(requestsQuery)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const updateRequestStatus = async (requestId, newStatus, ownerReply = '') => {
  const now = new Date().toISOString()
  const requestRef = doc(db, 'requests', requestId)
  const requestSnap = await getDoc(requestRef)

  if (!requestSnap.exists()) {
    throw new Error('Request not found')
  }

  const requestData = requestSnap.data()
  const currentStatus = requestData.status
  const timeline = requestData.timeline || []

  const updateData = {
    status: newStatus,
    updatedAt: now
  }

  if (newStatus !== currentStatus) {
    updateData.timeline = [...timeline, { status: newStatus, createdAt: now }]
  } else {
    updateData.timeline = timeline
  }

  if (newStatus === 'completed') {
    updateData.completedAt = now
  }

  if (ownerReply) {
    updateData.ownerReply = ownerReply
  }

  const batch = writeBatch(db)
  batch.update(requestRef, updateData)

  if (newStatus === 'accepted' && requestData.postId) {
    const postRef = doc(db, 'posts', requestData.postId)
    batch.update(postRef, {
      isAvailable: false,
      updatedAt: now
    })

    const pendingQuery = query(
      collection(db, 'requests'),
      where('postId', '==', requestData.postId),
      where('status', '==', 'pending')
    )
    const pendingSnapshot = await getDocs(pendingQuery)

    pendingSnapshot.docs.forEach((pendingDoc) => {
      if (pendingDoc.id !== requestId) {
        const pendingData = pendingDoc.data()
        batch.update(doc(db, 'requests', pendingDoc.id), {
          status: 'declined',
          updatedAt: now,
          ownerReply: 'Item claimed by another neighbor',
          timeline: [...(pendingData.timeline || []), { status: 'declined', createdAt: now }],
          autoDeclined: true
        })
      }
    })
  }

  if (newStatus === 'completed' && requestData.postId) {
    const postRef = doc(db, 'posts', requestData.postId)
    batch.update(postRef, {
      status: 'completed',
      isAvailable: false,
      completedAt: now,
      updatedAt: now
    })
  }

  await batch.commit()

  return { id: requestId, ...requestData, ...updateData }
}

export const markRequestRated = async (requestId, stars, comment) => {
  const now = new Date().toISOString()
  const requestRef = doc(db, 'requests', requestId)
  const requestSnap = await getDoc(requestRef)

  if (!requestSnap.exists()) {
    throw new Error('Request not found')
  }

  const requestData = requestSnap.data()
  const updateData = {
    requesterRated: true,
    rating: {
      stars,
      comment,
      ratedAt: now
    },
    updatedAt: now
  }

  await updateDoc(requestRef, updateData)

  if (requestData.ownerId) {
    const ownerRequestsQuery = query(
      collection(db, 'requests'),
      where('ownerId', '==', requestData.ownerId),
      where('status', '==', 'completed'),
      where('requesterRated', '==', true)
    )
    const snapshot = await getDocs(ownerRequestsQuery)

    const ratings = snapshot.docs
      .map((doc) => doc.data().rating?.stars)
      .filter((value) => typeof value === 'number')

    const totalRatings = ratings.length
    const averageRating = totalRatings > 0 ? ratings.reduce((sum, value) => sum + value, 0) / totalRatings : 0

    const userRef = doc(db, 'users', requestData.ownerId)
    await updateDoc(userRef, {
      averageRating,
      totalRatings
    })

    return {
      ...requestData,
      ...updateData,
      ownerAverageRating: averageRating,
      ownerTotalRatings: totalRatings
    }
  }

  return { ...requestData, ...updateData }
}