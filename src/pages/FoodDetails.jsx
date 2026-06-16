import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { createRequest } from '../services/requestService';
import Header from '../components/ui/Header';

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [ownerRating, setOwnerRating] = useState(null);
  const [ownerRatingCount, setOwnerRatingCount] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestPickupTime, setRequestPickupTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const item = { id: docSnap.id, ...docSnap.data() };
          setFoodItem(item);

          if (item.userId) {
            const userDocRef = doc(db, 'users', item.userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setOwnerName(userData.fullName || 'Unknown Owner');
              setOwnerRating(
                userData.averageRating !== undefined ? userData.averageRating : null
              );
              setOwnerRatingCount(userData.totalRatings || 0);
            }
          }
        } else {
          console.error('No such document!');
        }
      } catch (err) {
        console.error('Error fetching food item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  const handleRequest = async () => {
    if (!currentUser) {
      alert('Please log in to request food.');
      navigate('/login');
      return;
    }

    if (!requestPickupTime) {
      alert('Please select a pickup time.');
      return;
    }

    setSubmitting(true);
    try {
      await createRequest(foodItem, currentUser, requestPickupTime, requestMessage);
      alert('Request sent successfully!');
      setShowRequestModal(false);
      setRequestMessage('');
      setRequestPickupTime('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-center text-gray-500">Food item not found.</p>
      </div>
    );
  }

  const isOwner = currentUser?.uid === foodItem.userId;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8 pt-28">
        <div className="bg-white rounded-xl shadow-medium overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="h-[400px] bg-cover bg-center"
              style={{ backgroundImage: `url(${foodItem.imageUrl || 'https://via.placeholder.com/400'})` }}
            />

            <div className="p-8">
              <h1 className="text-3xl font-bold text-text-dark mb-4">
                {foodItem.foodName}
              </h1>

              <div className="space-y-4">
                <p className="text-text-light">{foodItem.description}</p>

                <div className="flex items-center gap-2">
                  <span className="text-text-dark">📍</span>
                  <span>{foodItem.pickupLocation}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-text-dark">⏰</span>
                  <span>Available {foodItem.availabilityStartTime} - {foodItem.availabilityEndTime}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-text-dark">⚠️</span>
                  <span>Expires on {foodItem.expiryDate}</span>
                </div>

                {foodItem.dietaryPreferences && foodItem.dietaryPreferences.length > 0 && (
                  <div className="flex gap-2">
                    {foodItem.dietaryPreferences.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-secondary rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t border-muted pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      {ownerName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{ownerName || 'Owner'}</p>
                      <p className="text-sm text-text-light">
                        {ownerRating != null && ownerRatingCount > 0
                          ? `⭐ ${Number(ownerRating).toFixed(1)} (${ownerRatingCount} ratings)`
                          : 'No ratings yet'}
                      </p>
                    </div>
                  </div>
                </div>

                {isOwner ? (
                  <p className="text-center text-gray-500 italic">You own this item</p>
                ) : (
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full btn-primary"
                  >
                    Request This Food
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Request {foodItem.foodName}</h3>
              <label className="block text-sm font-medium mb-2">Preferred Pickup Time *</label>
              <input
                type="time"
                value={requestPickupTime}
                onChange={(e) => setRequestPickupTime(e.target.value)}
                className="w-full p-3 border border-muted rounded-lg mb-4"
                required
              />
              <label className="block text-sm font-medium mb-2">Message (Optional)</label>
              <textarea
                className="w-full p-3 border border-muted rounded-lg mb-4"
                placeholder="When can you pick up? Add any other relevant details..."
                rows="4"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequest}
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FoodDetails;