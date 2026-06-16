import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { auth, db } from './config/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Header from './components/ui/Header'
import { useNotifications } from './hooks/useNotifications'
import LoadingSpinner from './components/ui/LoadingSpinner' 

// Lazy load components to prevent circular dependencies
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Browse = lazy(() => import('./pages/Browse'))
const MyListings = lazy(() => import('./pages/MyListings'))
const FoodDetails = lazy(() => import('./pages/FoodDetails'))
const NewItem = lazy(() => import('./pages/NewItem'))
const Profile = lazy(() => import('./pages/Profile'))

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [incomingRequests, setIncomingRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Fetch requests whenever user changes
  useEffect(() => {
    if (!user?.uid) {
      setIncomingRequests([])
      setOutgoingRequests([])
      return
    }

    const fetchRequests = async () => {
      try {
        const [incomingSnap, outgoingSnap] = await Promise.all([
          getDocs(query(collection(db, 'requests'), where('ownerId', '==', user.uid))),
          getDocs(query(collection(db, 'requests'), where('requesterId', '==', user.uid)))
        ])
        setIncomingRequests(incomingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        setOutgoingRequests(outgoingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch (err) {
        console.error('Error fetching requests for notifications:', err)
      }
    }

    fetchRequests()
  }, [user?.uid])

  const { notifications, markAsRead, markAllAsRead } = useNotifications(
    incomingRequests,
    outgoingRequests
  )

  if (loading) return <LoadingSpinner />

  return (
    <Router>
      <Header
        user={user}
        notifications={notifications}
        markAsRead={markAsRead}
        markAllAsRead={markAllAsRead}
      />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/browse" element={<Browse user={user} />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/new-item" element={<NewItem />} />
          <Route path="/about" element={<div>About Page (Coming Soon)</div>} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App