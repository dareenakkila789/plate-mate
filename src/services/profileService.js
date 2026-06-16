import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

export const fetchUserData = (setUser, setEditedUser, setListings, setIncomingRequests, setOutgoingRequests, setUserNames, setLoading) => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)
        const firestoreData = userDoc.exists() ? userDoc.data() : {}

        const fullUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firestoreData.fullName || '',
          email: firebaseUser.email,
          location: firestoreData.location || '',
          joinedDate: firestoreData.createdAt
            ? new Date(firestoreData.createdAt.toDate()).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })
            : 'Unknown',
          averageRating: firestoreData.averageRating ?? 0,
          totalRatings: firestoreData.totalRatings ?? 0
        }

        setUser(fullUser)
        setEditedUser(fullUser)

        const listingsQuery = query(collection(db, 'posts'), where('userId', '==', firebaseUser.uid))
        const listingsSnapshot = await getDocs(listingsQuery)
        const listingsData = listingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setListings(listingsData)

        const incomingQuery = query(collection(db, 'requests'), where('ownerId', '==', firebaseUser.uid))
        const incomingSnapshot = await getDocs(incomingQuery)
        const incomingData = incomingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setIncomingRequests(incomingData)

        const outgoingQuery = query(collection(db, 'requests'), where('requesterId', '==', firebaseUser.uid))
        const outgoingSnapshot = await getDocs(outgoingQuery)
        const outgoingData = outgoingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setOutgoingRequests(outgoingData)

        const uids = new Set()
        incomingData.forEach((req) => uids.add(req.requesterId))
        outgoingData.forEach((req) => uids.add(req.ownerId))
        await Promise.all(Array.from(uids).map((uid) => fetchUserName(uid, setUserNames)))

        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setLoading(false)
      }
    } else {
      setUser(null)
      setLoading(false)
    }
  })

  return unsubscribe
}

const fetchUserName = async (uid, setUserNames) => {
  if (!uid) return
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    const name = userDoc.exists() ? userDoc.data().fullName || 'Unknown User' : 'Unknown User'
    setUserNames((prev) => ({ ...prev, [uid]: name }))
    return name
  } catch (err) {
    console.error('Error fetching user name:', err)
    return 'Unknown User'
  }
}

export const updateProfile = async (user, editedUser, setUser, setIsEditing, setActionLoading) => {
  setActionLoading(true)
  try {
    if (editedUser.name !== user.name) {
      await updateProfile(auth.currentUser, { displayName: editedUser.name })
    }
    const userDocRef = doc(db, 'users', user.uid)
    await setDoc(
      userDocRef,
      {
        fullName: editedUser.name,
        location: editedUser.location
      },
      { merge: true }
    )
    setUser(editedUser)
    setIsEditing(false)
  } catch (err) {
    console.error('Error updating profile:', err)
    alert('Failed to update profile. Please try again.')
  } finally {
    setActionLoading(false)
  }
}

export const deleteListing = async (listingId, listings, setListings, setIsDeleteDialogOpen, setActionLoading) => {
  setActionLoading(true)
  try {
    await deleteDoc(doc(db, 'posts', listingId))
    setListings(listings.filter((listing) => listing.id !== listingId))
    setIsDeleteDialogOpen(false)
  } catch (err) {
    console.error('Error deleting listing:', err)
    alert('Failed to delete listing. Please try again.')
  } finally {
    setActionLoading(false)
  }
}