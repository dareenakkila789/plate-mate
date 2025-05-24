// import React, { useState, useEffect } from "react";
// import { auth } from "../config/firebase";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";

// const Profile = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setEmail(user.email);
//         setLoading(false);
//       } else {
//         navigate("/login");
//       }
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       navigate("/login");
//     } catch (error) {
//       console.error("Error signing out:", error.message);
//     }
//   };

//   if (loading) {
//     return <div className="text-center mt-10">Loading...</div>;
//   }

//   return (
//     <div className="main-content flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
//         <h2 className="text-2xl font-bold mb-4">Profile</h2>
//         <p className="text-gray-700 mb-2">
//           <strong>Email:</strong> {email}
//         </p>

//         <button 
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mt-4"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, X } from 'lucide-react';

// Mock data
const mockUser = {
  name: 'Sarah Ahmad',
  email: 'sarah.ahmad@example.com',
  location: 'Ramallah',
  joinedDate: 'January 2024'
};

const mockListings = [
  {
    id: 1,
    title: 'Homemade Lasagna',
    description: 'Fresh lasagna, can serve 4-6 people.',
    image: 'https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg',
    status: 'active',
    requests: [
      { id: 1, user: 'Ahmad', status: 'pending' },
      { id: 2, user: 'Layla', status: 'accepted' }
    ]
  },
  {
    id: 2,
    title: 'Fresh Bread',
    description: '3 loaves of freshly baked bread.',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg',
    status: 'active',
    requests: [
      { id: 3, user: 'Omar', status: 'pending' }
    ]
  }
];
const mockOutgoingRequests = [
  {
    id: 1,
    itemTitle: 'Zaatar Manakeesh',
    itemImage: 'https://palestineinadish.com/wp-content/uploads/2024/04/Manakeesh-featured-photo.jpg',
    status: 'pending',
    owner: 'Narmeen'
  },
  {
    id: 2,
    itemTitle: 'Vegan Salad Bowl',
    itemImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    status: 'accepted',
    owner: 'Lina'
  },
  {
    id: 3,
    itemTitle: 'Chicken Kabsa',
    itemImage: 'https://moribyan.com/wp-content/uploads/2023/06/Chicken-Kabsa-1.jpg',
    status: 'declined',
    owner: 'Hani'
  }
];


export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [listings, setListings] = useState(mockListings);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editListingDialog, setEditListingDialog] = useState({
    open: false,
    listing: null
  });
  const [activeTab, setActiveTab] = useState('active');
const [outgoingRequests, setOutgoingRequests] = useState(mockOutgoingRequests);

  const handleUpdateProfile = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleDeleteListing = (listingId) => {
    setListings(listings.filter(listing => listing.id !== listingId));
    setIsDeleteDialogOpen(false);
  };

  const handleRequestResponse = (listingId, requestId, status) => {
    setListings(listings.map(listing => {
      if (listing.id === listingId) {
        return {
          ...listing,
          requests: listing.requests.map(request =>
            request.id === requestId ? { ...request, status } : request
          )
        };
      }
      return listing;
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow p-6 fixed top-0 left-0 right-0 z-10">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </header>

      <main className="container mx-auto px-6 pt-28 pb-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Section */}
          <section className="bg-white rounded-lg shadow p-8 mb-10 border-4 border-green-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
                <p className="text-gray-600 text-lg">Member since {user.joinedDate}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-3 border border-green-400 rounded px-5 py-2 hover:bg-green-50 text-lg"
                aria-label="Edit Profile"
              >
                {isEditing ? <><X size={20} /> Cancel</> : <><Edit2 size={20} /> Edit Profile</>}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-6 text-lg">
                <div>
                  <label htmlFor="name" className="block font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    id="location"
                    type="text"
                    value={editedUser.location}
                    onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="bg-green-300 hover:bg-green-400 rounded px-6 py-3 font-semibold text-gray-900 text-lg"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-gray-900 text-lg">
                <div>
                  <p className="font-semibold">Full Name</p>
                  <p>{user.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p>{user.location}</p>
                </div>
              </div>
            )}
          </section>

          {/* Tabs */}
          <section>
            <div className="flex border-b-2 border-green-300 mb-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 font-semibold -mb-px text-lg ${
                  activeTab === 'active'
                    ? 'border-b-4 border-green-400 text-green-600'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                Active Listings
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-3 font-semibold -mb-px text-lg ${
                  activeTab === 'requests'
                    ? 'border-b-4 border-green-400 text-green-600'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                Requests
              </button>
              <button
  onClick={() => setActiveTab('outgoing')}
  className={`px-6 py-3 font-semibold -mb-px text-lg ${
    activeTab === 'outgoing'
      ? 'border-b-4 border-green-400 text-green-600'
      : 'text-gray-600 hover:text-green-500'
  }`}
>
  Requested Items
</button>

            </div>

            {activeTab === 'active' && (
              <div className="space-y-8">
                {listings.map(listing => (
                  <article key={listing.id} className="bg-white rounded shadow overflow-hidden flex flex-col md:flex-row border-4 border-green-700">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full md:w-64 lg:w-80 h-64 lg:h-80 object-cover border-b-2 md:border-b-0 md:border-r-2 border-green-100"
                    />
                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold">{listing.title}</h3>
                        <p className="text-gray-600 text-lg mt-2">{listing.description}</p>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={() => setEditListingDialog({ open: true, listing })}
                          className="border border-gray-400 rounded px-5 py-2 hover:bg-gray-100 flex items-center gap-2 text-lg"
                          aria-label="Edit Listing"
                        >
                          <Edit2 size={20} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedListing(listing.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="border border-red-600 text-red-600 rounded px-5 py-2 hover:bg-red-100 flex items-center gap-2 text-lg"
                          aria-label="Delete Listing"
                        >
                          <Trash2 size={20} /> Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-6">
                {listings.flatMap(listing =>
                  listing.requests.map(request => (
                    <div key={`${listing.id}-${request.id}`} className="bg-white rounded shadow p-8 flex justify-between items-center text-lg border-4 border-green-700">
                      <div>
                        <h4 className="font-semibold text-xl">{request.user}</h4>
                        <p className="text-gray-600 mt-1">Requested: {listing.title}</p>
                      </div>
                      {request.status === 'pending' ? (
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleRequestResponse(listing.id, request.id, 'accepted')}
                            className="bg-green-300 hover:bg-green-400 rounded px-6 py-3 font-semibold"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestResponse(listing.id, request.id, 'declined')}
                            className="border border-gray-400 rounded px-6 py-3 hover:bg-gray-100"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="capitalize text-gray-600 text-lg">{request.status}</span>
                      )}
                    </div>

              ))
            )}
          </div>
        )}

        {activeTab === 'outgoing' && (
          <div className="space-y-10">
            {['pending', 'accepted', 'declined'].map((statusKey) => {
              const filtered = outgoingRequests.filter(req => req.status === statusKey);
              return (
                <div key={statusKey}>
                  <h3 className="text-2xl font-semibold capitalize text-gray-800 mb-4">
                    {statusKey === 'declined' ? 'Rejected' : statusKey}
                  </h3>
                  {filtered.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.map((req) => (
                        <div key={req.id} className="bg-white rounded shadow p-6 flex flex-col items-center text-center border-4 border-green-700">
                          <img
                            src={req.itemImage}
                            alt={req.itemTitle}
                            className="w-full h-48 object-cover rounded mb-4 border-b-4 border-green-600"
                          />
                          <h4 className="text-xl font-semibold">{req.itemTitle}</h4>
                          <p className="text-gray-600 mt-1">From: {req.owner}</p>
                          <span className={`mt-3 text-sm font-medium capitalize ${
                            req.status === 'pending'
                              ? 'text-yellow-600'
                              : req.status === 'accepted'
                              ? 'text-green-600'
                              : 'text-red-500'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-lg">No {statusKey} requests.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </motion.div>
  </main>

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded p-8 max-w-md w-full shadow-lg">
            <h3 className="text-2xl font-semibold mb-6">Delete Listing</h3>
            <p className="mb-8 text-lg">Are you sure you want to delete this listing? This action cannot be undone.</p>
            <div className="flex justify-end gap-6">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-6 py-3 rounded border border-gray-400 hover:bg-gray-100 text-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedListing && handleDeleteListing(selectedListing)}
                className="px-6 py-3 rounded bg-red-600 text-white hover:bg-red-700 text-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editListingDialog.open && editListingDialog.listing && (
        <EditListingModal
          listing={editListingDialog.listing}
          onClose={() => setEditListingDialog({ open: false, listing: null })}
        />
      )}
    </div>
  );
}

function EditListingModal({
  listing,
  onClose
}) {
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded p-8 max-w-lg w-full shadow-lg">
        <h3 className="text-3xl font-semibold mb-6">Edit Listing</h3>
        <div className="space-y-6 text-lg">
          <div>
            <label htmlFor="listing-title" className="block font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              id="listing-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label htmlFor="listing-description" className="block font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="listing-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="flex justify-end gap-6">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded border border-gray-400 hover:bg-gray-100 text-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // add save logic here
                onClose();
              }}
              className="px-6 py-3 rounded bg-green-400 text-gray-900 hover:bg-green-500 text-lg font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
