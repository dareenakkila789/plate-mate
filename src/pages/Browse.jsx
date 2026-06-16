import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { districts, categories, dietaryOptions, freshnessOptions, sortOptions } from '../constants/browseFilters'
import { parseDate, isWithinDays, isExpired } from '../utils/browseHelpers'
import BrowseHero from '../components/browse/BrowseHero'
import BrowseFilters from '../components/browse/BrowseFilters'
import ListingGrid from '../components/browse/ListingGrid'
import EmptyState from '../components/browse/EmptyState'
import RequestModal from '../components/browse/RequestModal'
import { fetchPosts } from '../services/postService'
import { createRequest } from '../services/requestService'

function Browse({ user }) {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRequests, setUserRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDietary, setSelectedDietary] = useState('')
  const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState('')
  const [selectedFreshness, setSelectedFreshness] = useState('all')
  const [sortOption, setSortOption] = useState('newest')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [requestMessage, setRequestMessage] = useState('')
  const [requestPickupTime, setRequestPickupTime] = useState('')
  const [submittingRequest, setSubmittingRequest] = useState(false)

  const loadUserRequests = async () => {
    if (!user?.uid) {
      setUserRequests([])
      return
    }

    try {
      const requestsQuery = query(
        collection(db, 'requests'),
        where('requesterId', '==', user.uid)
      )
      const snapshot = await getDocs(requestsQuery)
      setUserRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      console.error('Error fetching user requests:', err)
    }
  }

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchPosts()
        console.log('All posts from DB:', postsData)
      console.log('Sample post:', postsData[0])
        setPosts(postsData)
      } catch (err) {
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  useEffect(() => {
    loadUserRequests()
  }, [user?.uid])

  const requestStatusByPost = useMemo(() => {
    const map = new Map()
    userRequests.forEach((req) => {
      if (req.postId) map.set(req.postId, req.status)
    })
    return map
  }, [userRequests])

  const openRequestModal = (listing) => {
    if (!user) {
      alert('Please sign in to request food.')
      navigate('/login')
      return
    }

    if (listing.userId === user.uid) {
      alert('You cannot request your own item.')
      return
    }

    if (!listing.isAvailable) {
      alert('This item is no longer available.')
      return
    }

    const alreadyRequested = userRequests.some((req) => req.postId === listing.id)
    if (alreadyRequested) {
      alert('You already requested this item.')
      return
    }

    setSelectedListing(listing)
    setRequestMessage('')
    setRequestPickupTime('')
    setShowRequestModal(true)
  }

  const handleRequest = async () => {
    try {
      setSubmittingRequest(true)
      await createRequest(selectedListing, user, requestPickupTime, requestMessage)
      alert('Request sent successfully!')
      setShowRequestModal(false)
      setSelectedListing(null)
      setRequestMessage('')
      setRequestPickupTime('')
      await loadUserRequests()
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmittingRequest(false)
    }
  }

  const filteredPosts = posts
    .filter((post) => {
      const expiryDate = parseDate(post.expiryDate)
if (expiryDate) {
  const endOfDay = new Date(expiryDate)
  endOfDay.setHours(23, 59, 59, 999)
  if (endOfDay < new Date()) return false
}
      if (post.isAvailable === false) return false

      const search = searchTerm.trim().toLowerCase()
      const matchesSearch =
        !search ||
        post.foodName?.toLowerCase().includes(search) ||
        post.description?.toLowerCase().includes(search) ||
        post.pickupLocation?.toLowerCase().includes(search) ||
        post.category?.toLowerCase().includes(search)
      const matchesDistrict = !selectedDistrict || post.pickupLocation === selectedDistrict
      const matchesCategory = !selectedCategory || post.category === selectedCategory
      const matchesDietary = !selectedDietary || post.dietaryPreferences?.includes(selectedDietary)
      const matchesAvailabilityDate = !selectedAvailabilityDate || post.pickupDate === selectedAvailabilityDate
      const matchesFreshness = (() => {
        if (selectedFreshness === 'all') return true
        if (selectedFreshness === 'expiringSoon') return isWithinDays(post.expiryDate, 2)
        if (selectedFreshness === 'today') return parseDate(post.expiryDate)?.toDateString() === new Date().toDateString()
        if (selectedFreshness === 'fresh') {
          const expiry = parseDate(post.expiryDate)
          if (!expiry) return false
          const today = new Date()
          today.setHours(23, 59, 59, 999)
          return expiry > new Date(today.setDate(today.getDate() + 3))
        }
        return true
      })()

      return matchesSearch && matchesDistrict && matchesCategory && matchesDietary && matchesAvailabilityDate && matchesFreshness
    })
    .sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortOption === 'pickupSoon') {
        if (a.pickupDate === b.pickupDate) return a.availabilityStartTime.localeCompare(b.availabilityStartTime)
        return new Date(a.pickupDate) - new Date(b.pickupDate)
      }
      if (sortOption === 'expirySoon') return new Date(a.expiryDate) - new Date(b.expiryDate)
      return 0
    })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    )
  }
console.log('Total posts in state:', posts.length)
console.log('Filtered posts:', filteredPosts)
  return (
    <div className="min-h-screen bg-white text-xl">
      <BrowseHero searchTerm={searchTerm} setSearchTerm={setSearchTerm} onShare={() => navigate('/new-item')} />
      <BrowseFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedDietary={selectedDietary}
        setSelectedDietary={setSelectedDietary}
        selectedAvailabilityDate={selectedAvailabilityDate}
        setSelectedAvailabilityDate={setSelectedAvailabilityDate}
        selectedFreshness={selectedFreshness}
        setSelectedFreshness={setSelectedFreshness}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <div className="max-w-screen-xl mx-auto px-6 pb-20">
        <ListingGrid
          listings={filteredPosts}
          user={user}
          onRequest={openRequestModal}
          onView={(id) => navigate(`/food/${id}`)}
          requestStatusByPost={requestStatusByPost}
        />
        {filteredPosts.length === 0 && <EmptyState />}
      </div>
      <RequestModal
        open={showRequestModal}
        listing={selectedListing}
        requestMessage={requestMessage}
        setRequestMessage={setRequestMessage}
        requestPickupTime={requestPickupTime}
        setRequestPickupTime={setRequestPickupTime}
        submitting={submittingRequest}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleRequest}
      />
    </div>
  )
}

export default Browse