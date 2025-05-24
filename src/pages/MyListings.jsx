// import { useEffect, useState } from "react";
// import { db, auth } from "../config/firebase";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { Link } from "react-router-dom";

// const MyListings = () => {
//   const [myItems, setMyItems] = useState([]);

//   useEffect(() => {
//     const fetchMyListings = async () => {
//       try {
//         const q = query(collection(db, "posts"), where("userId", "==", auth.currentUser.uid));
//         const querySnapshot = await getDocs(q);
//         const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setMyItems(listings);
//       } catch (err) {
//         console.error("Error fetching my listings:", err);
//       }
//     };

//     fetchMyListings();
//   }, []);

//   return (
//     <div className="main-content flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">My Listings</h2>
//         <Link to="/NewItem" className="bg-blue-500 text-white px-4 py-2 rounded">+ Add New Item</Link>
//       </div>

//       {myItems.length === 0 ? (
//         <p>No items listed yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {myItems.map((item) => (
//             <div key={item.id} className="bg-white p-4 rounded shadow">
//               <img src={item.imageUrl} alt={item.foodName} className="h-40 w-full object-cover rounded" />
//               <h3 className="font-semibold mt-2">{item.foodName}</h3>
//               <p className="text-sm text-gray-600">{item.description}</p>
//               <p className="text-xs mt-1">Available: {item.availabilityStartTime} - {item.availabilityEndTime}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyListings;
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'

// Dummy data for user's listings
const dummyUserListings = [
  {
    id: 1,
    title: "Homemade Lasagna",
    description: "Fresh lasagna, serves 4-6 people",
    location: "District 8",
    image: "https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg",
    datePosted: "2024-03-20",
    status: "Available",
    requests: [
      { id: 1, user: "Sarah", status: "pending" },
      { id: 2, user: "Mike", status: "declined" }
    ]
  },
  {
    id: 2,
    title: "Organic Apples",
    description: "6 fresh apples from my garden",
    location: "District 3",
    image: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg",
    datePosted: "2024-03-19",
    status: "Requested",
    requests: [
      { id: 3, user: "John", status: "accepted" }
    ]
  }
]

function MyListings() {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)

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
    // In real app, update request status here
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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

        {dummyUserListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyUserListings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl overflow-hidden shadow-medium"
              >
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${listing.image})` }}
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      listing.status === 'Available' ? 'bg-secondary' : 'bg-primary'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  
                  <p className="text-text-light mb-2">{listing.description}</p>
                  <p className="text-text-light mb-4">📍 {listing.location}</p>

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
                      View Requests ({listing.requests.length})
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-medium">
            <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
            <p className="text-text-light mb-4">Share your first food item with the community!</p>
            <button 
              onClick={() => navigate('/share-food')}
              className="btn-primary"
            >
              Share Food
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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
                Are you sure you want to delete "{selectedListing?.title}"? This action cannot be undone.
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

      {/* Requests Modal */}
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
              <h3 className="text-xl font-semibold mb-4">Requests for {selectedListing?.title}</h3>
              <div className="space-y-4">
                {selectedListing?.requests.map((request) => (
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
                ))}
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