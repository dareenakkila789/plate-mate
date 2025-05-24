// import React, { useEffect, useState } from "react";
// import { db } from "../config/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { MapPin, Tag } from "lucide-react";

// function Browse() {
//   const [posts, setPosts] = useState([]); // State to store fetched posts
//   const navigate = useNavigate(); // For navigation to FoodItemPage

//   const postsCollectionRef = collection(db, "posts");

//   // Fetch posts from Firestore
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const data = await getDocs(postsCollectionRef);
//         const postsData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setPosts(postsData);
//       } catch (err) {
//         console.error("Error fetching posts:", err);
//       }
//     };

//     fetchPosts();
//   }, []);

//   return (
//     <div className="main-content">
//       <div className="browse-container">
//         <h1 className="browse-title text-2xl font-bold mb-6">Browse Available Food</h1>

//         {/* Food Grid */}
//         <div className="food-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {posts.map((post) => (
//             <div
//               key={post.id}
//               className="food-card bg-white rounded-lg shadow-md p-4 cursor-pointer"
//               onClick={() => navigate(`/food/${post.id}`)} // Navigate to FoodItemPage
//             >
//               {/* Food Image */}
//               <img
//                 src={post.imageUrl}
//                 alt={post.foodName}
//                 className="food-image w-full h-48 object-cover rounded mb-4"
//               />

//               {/* Food Content */}
//               <div className="food-content">
//                 <h3 className="food-title text-lg font-bold mb-2">{post.foodName}</h3>

//                 {/* Location */}
//                 <div className="food-location flex items-center text-sm text-gray-500 mb-2">
//                   <MapPin className="location-icon h-4 w-4 mr-1" />
//                   <span>{post.pickupLocation}</span>
//                 </div>

//                 {/* Dietary Preferences */}
//                 <div className="tag-container flex flex-wrap gap-2">
//                   {post.dietaryPreferences &&
//                     post.dietaryPreferences.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="tag bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center"
//                       >
//                         <Tag className="tag-icon h-3 w-3 mr-1" />
//                         {tag}
//                       </span>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Browse;
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import Header from '../components/Header'

// Dummy data for food listings
const dummyListings = [
  {
    id: 1,
    title: "Homemade Chocolate Cake",
    location: "District 5",
    image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
    timePosted: "2 hours ago",
    expires: "Today",
    dietary: ["Vegetarian"],
    owner: "user123"
  },
  {
    id: 2,
    title: "Fresh Vegetables Bundle",
    location: "District 12",
    image: "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg",
    timePosted: "5 hours ago",
    expires: "Tomorrow",
    dietary: ["Vegan", "Gluten-Free"],
    owner: "user456"
  },
  {
    id: 3,
    title: "Leftover Pizza (4 slices)",
    location: "District 3",
    image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
    timePosted: "1 hour ago",
    expires: "Today",
    owner: "currentUser"
  }
]

// Generate district options
const districts = Array.from({ length: 22 }, (_, i) => ({
  value: `district-${i + 1}`,
  label: `District ${i + 1}`
}))

function Browse({ user }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)

  const handleSearch = () => {
    console.log('Searching for:', searchTerm)
    // You can filter or fetch results here
  }

  const handleRequest = (listing) => {
    if (!user) {
      alert('Please sign in to request food.')
      navigate('/login')
      return
    }
    setSelectedListing(listing)
    setShowRequestModal(true)
  }

  const sendRequest = () => {
    console.log('Request sent for:', selectedListing?.title)
    setShowRequestModal(false)
    alert('Request sent! The owner will contact you soon.')
  }

  return (
  <div className="min-h-screen bg-white text-xl">
    {/* Hero Section */}
    <div className="bg-gradient-to-b from-green-50 to-white w-full">
      <div className="max-w-8xl mx-auto px-6 sm:px-12 lg:px-24 py-20 text-center">
        <section className="text-center py-20 bg-gradient-to-b from-green-50 to-white">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Discover Shared Meals in Your Neighborhood
          </h1>
          <p className="text-gray-600 text-2xl mb-10 max-w-4xl mx-auto">
            Browse homemade dishes, fresh ingredients, and surplus food shared by your community.
            Find something you need—and help reduce food waste together.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <button
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl shadow-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
              onClick={() => navigate('/new-item')}
            >
              Share Food
            </button>
            
          </div>
        </section>

        {/* Search Bar */}
        <div className="mt-14 w-full max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row rounded-xl shadow-lg overflow-hidden border-2 border-gray-700">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={24} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full py-4 pl-12 pr-4 text-lg rounded-t-xl sm:rounded-t-none sm:rounded-l-xl border-2 border-gray-700 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Search for dishes, ingredients, or neighbors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="bg-green-500 hover:bg-orange-600 text-white text-lg font-semibold px-8 py-4 sm:rounded-r-xl sm:rounded-l-none rounded-b-xl sm:rounded-b-none border-2 border-l-0 border-gray-700"
            >
              Search
            </button>
          </div>
        </div>
    </div>
</div>

  {/* Filters */}
  <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select
            className="px-5 py-3 rounded-lg border border-muted focus:outline-none focus:border-primary text-base"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="baked">Baked Goods</option>
            <option value="cooked">Cooked Meals</option>
            <option value="fruits">Fruits & Vegetables</option>
            <option value="other">Other</option>
          </select>

          <select
            className="px-5 py-3 rounded-lg border border-muted focus:outline-none focus:border-primary text-base"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {districts.map((district) => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>

          <select
            className="px-5 py-3 rounded-lg border border-muted focus:outline-none focus:border-primary text-base"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="expiring">Expiring Soon</option>
          </select>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyListings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl overflow-hidden shadow-medium"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${listing.image})` }}
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{listing.title}</h3>
                <p className="text-text-light mb-2">📍 {listing.location}</p>
                <p className="text-text-light mb-4">⏰ {listing.timePosted}</p>

                {listing.dietary && listing.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.dietary.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-secondary text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => navigate(`/food/${listing.id}`)}
                    className="text-primary hover:text-accent text-base font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleRequest(listing)}
                    className="btn-primary text-base font-medium"
                  >
                    Request
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {dummyListings.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-2">No food matches your filters right now</h3>
            <p className="text-text-light text-base">Check back later or try different filters!</p>
          </div>
        )}
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setShowRequestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full text-base"
            >
              <h3 className="text-2xl font-semibold mb-4">Request {selectedListing?.title}</h3>
              <textarea
                className="w-full p-3 border border-muted rounded-lg mb-4 text-base"
                placeholder="When can you pick up?"
                rows="3"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="btn-secondary text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={sendRequest}
                  className="btn-primary text-base"
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Browse


