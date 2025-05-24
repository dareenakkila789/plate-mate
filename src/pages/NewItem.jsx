// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { db, auth, storage } from "../config/firebase"; // Import storage from Firebase
// import { getDocs, collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage methods

// const NewItem = () => {
//   const [foodName, setFoodName] = useState("");
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null); // Image as a file
//   const [expiryDate, setExpiryDate] = useState("");
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [dietaryPreferences, setDietaryPreferences] = useState([]);
//   const [otherDietaryPreference, setOtherDietaryPreference] = useState("");
//   const [availabilityStartTime, setAvailabilityStartTime] = useState("");
//   const [availabilityEndTime, setAvailabilityEndTime] = useState("");
//   const [posts, setPosts] = useState([]); // State to store fetched posts
//   const [userId, setUserId] = useState(null); // Automatically set userId

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

//   // Get the current user's ID
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUserId(user.uid); // Set the userId to the logged-in user's UID
//       } else {
//         setUserId(null); // No user is logged in
//       }
//     });

//     return () => unsubscribe(); // Cleanup subscription
//   }, []);

//   const handleDietaryChange = (e) => {
//     const { value, checked } = e.target;
//     setDietaryPreferences((prev) =>
//       checked ? [...prev, value] : prev.filter((item) => item !== value)
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!userId) {
//       console.error("User is not logged in.");
//       return;
//     }

//     if (!image) {
//       console.error("Image is required.");
//       return;
//     }

//     try {
//       // Upload the image to Firebase Storage
//       const imageRef = ref(storage, `food-images/${Date.now()}-${image.name}`);
//       await uploadBytes(imageRef, image);
//       const imageUrl = await getDownloadURL(imageRef);

//       // Add the post to Firestore
//       await addDoc(postsCollectionRef, {
//         foodName,
//         description,
//         expiryDate,
//         pickupLocation,
//         dietaryPreferences: dietaryPreferences.includes("Other")
//           ? [...dietaryPreferences.filter((p) => p !== "Other"), otherDietaryPreference]
//           : dietaryPreferences,
//         availabilityStartTime,
//         availabilityEndTime,
//         userId, // Automatically set userId
//         imageUrl, // Store the image URL
//         isAvailable: true, // Default value
//         createdAt: new Date().toISOString(), // Local timestamp
//       });

//       // Clear form fields
//       setFoodName("");
//       setDescription("");
//       setImage(null);
//       setExpiryDate("");
//       setPickupLocation("");
//       setDietaryPreferences([]);
//       setOtherDietaryPreference("");
//       setAvailabilityStartTime("");
//       setAvailabilityEndTime("");

//       // Refresh posts
//       const data = await getDocs(postsCollectionRef);
//       const postsData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setPosts(postsData);
//     } catch (err) {
//       console.error("Error saving post:", err);
//     }
//   };

//   return (
//     <div className="main-content flex flex-col items-center min-h-screen bg-gray-100 p-4">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4">
//         <h2 className="text-xl font-semibold">Post New Food Item</h2>
//         <input
//           type="text"
//           placeholder="Food Name"
//           value={foodName}
//           onChange={(e) => setFoodName(e.target.value)}
//           required
//           className="input"
//         />
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//           className="input"
//         />
//         <input
//           type="file"
//           onChange={(e) => setImage(e.target.files[0])} // Set the image file
//           required
//           className="input"
//         />
//         <input
//           type="date"
//           value={expiryDate}
//           onChange={(e) => setExpiryDate(e.target.value)}
//           className="input"
//         />
//         <input
//           type="text"
//           placeholder="Pickup Location"
//           value={pickupLocation}
//           onChange={(e) => setPickupLocation(e.target.value)}
//           required
//           className="input"
//         />
//         <div className="space-y-2">
//           <p className="font-medium">Dietary Preferences:</p>
//           {["Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "Other"].map((option) => (
//             <label key={option} className="block">
//               <input
//                 type="checkbox"
//                 value={option}
//                 checked={dietaryPreferences.includes(option)}
//                 onChange={handleDietaryChange}
//               />
//               <span className="ml-2">{option}</span>
//             </label>
//           ))}
//           {dietaryPreferences.includes("Other") && (
//             <input
//               type="text"
//               value={otherDietaryPreference}
//               onChange={(e) => setOtherDietaryPreference(e.target.value)}
//               placeholder="Specify other"
//               className="input"
//             />
//           )}
//         </div>
//         <div>
//           <label>Available From:</label>
//           <input
//             type="time"
//             value={availabilityStartTime}
//             onChange={(e) => setAvailabilityStartTime(e.target.value)}
//             className="input"
//           />
//         </div>
//         <div>
//           <label>Available Until:</label>
//           <input
//             type="time"
//             value={availabilityEndTime}
//             onChange={(e) => setAvailabilityEndTime(e.target.value)}
//             className="input"
//           />
//         </div>
//         <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
//           Post Food
//         </button>
//       </form>

      
//     </div>
//   );
// };

// export default NewItem;

import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { db, auth, storage } from "../config/firebase"; // Import storage from Firebase
import { getDocs, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage methods


const NewItem = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // Image as a file
  const [expiryDate, setExpiryDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [otherDietaryPreference, setOtherDietaryPreference] = useState("");
  const [availabilityStartTime, setAvailabilityStartTime] = useState("");
  const [availabilityEndTime, setAvailabilityEndTime] = useState("");
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [userId, setUserId] = useState(null); // Automatically set userId
  const [previewImages, setPreviewImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const postsCollectionRef = collection(db, "posts");
  const dietaryOptions = ["Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "Other"];

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getDocs(postsCollectionRef);
        const postsData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  // Get the current user's ID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // Set the userId to the logged-in user's UID
      } else {
        setUserId(null); // No user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);


  const handleDietaryChange = (e) => {
    const { value, checked } = e.target;
    setDietaryPreferences((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImage(files[0]);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User is not logged in.");
      return;
    }

    if (!image) {
      console.error("Image is required.");
      return;
    }

    try {
      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `food-images/${Date.now()}-${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Add the post to Firestore
      await addDoc(postsCollectionRef, {
        foodName,
        description,
        expiryDate,
        pickupLocation,
        dietaryPreferences: dietaryPreferences.includes("Other")
          ? [...dietaryPreferences.filter((p) => p !== "Other"), otherDietaryPreference]
          : dietaryPreferences,
        availabilityStartTime,
        availabilityEndTime,
        userId, // Automatically set userId
        imageUrl, // Store the image URL
        isAvailable: true, // Default value
        createdAt: new Date().toISOString(), // Local timestamp
      });

      setShowSuccess(true);

      // Clear form fields
      setFoodName("");
      setDescription("");
      setImage(null);
      setExpiryDate("");
      setPickupLocation("");
      setDietaryPreferences([]);
      setOtherDietaryPreference("");
      setAvailabilityStartTime("");
      setAvailabilityEndTime("");

      // Refresh posts
      const data = await getDocs(postsCollectionRef);
      const postsData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      
      <div className="container-custom py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 md:p-10 border-2 border-green-700"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
            Share Your Food
          </h1>
          <p className="text-text-light mb-8 text-lg">
            Fill in the details below to share your food with the community.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8 text-lg">
            {/* Food Name */}
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-text-dark mb-2">
                Food Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-muted focus:outline-none focus:border-primary text-base"
                placeholder="e.g., Homemade Chocolate Cake"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-lg font-semibold text-text-dark mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-6 py-4 rounded-xl border-2 border-muted focus:outline-none focus:border-primary text-xl"
                placeholder="Tell us more about the food (ingredients, preparation date, etc.)"
              />
            </div>

            {/* Location */}
            <div>
  <label htmlFor="pickupLocation" className="block text-lg font-semibold text-text-dark mb-2">
    Pickup Location *
  </label>
  <select
    id="pickupLocation"
    name="pickupLocation"
    required
    value={pickupLocation}
    onChange={(e) => setPickupLocation(e.target.value)}
    className="w-full px-6 py-4 rounded-xl border-2 border-muted focus:outline-none focus:border-primary text-xl"
  >
    <option value="">Select a district</option>
    {Array.from({ length: 22 }, (_, i) => (
      <option key={i + 1} value={`District ${i + 1}`}>
        District {i + 1}
      </option>
    ))}
  </select>
</div>

            {/* Expiry Date */}
            <div>
              <label htmlFor="expiryDate" className="block text-lg font-semibold text-text-dark mb-2">
                Best Before *
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-6 py-4 rounded-xl border-2 border-muted focus:outline-none focus:border-primary text-xl"
              />
            </div>

            {/* Available From */}
            <div>
              <label className="block text-lg font-semibold mb-2">Available From:</label>
              <input
                type="time"
                value={availabilityStartTime}
                onChange={(e) => setAvailabilityStartTime(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-muted focus:outline-none focus:border-primary text-xl"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Available Until:</label>
              <input
                type="time"
                value={availabilityEndTime}
                onChange={(e) => setAvailabilityEndTime(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-muted focus:outline-none focus:border-primary text-xl"
              />
            </div>

            {/* Dietary Tags */}
            <div>
              <label className="block text-lg font-semibold text-text-dark mb-3">
                Dietary Information
              </label>
              <div className="flex flex-wrap gap-4">
                {dietaryOptions.map(option => (
                  <label key={option} className="flex items-center gap-3 text-xl">
                    <input
                      type="checkbox"
                      value={option}
                      checked={dietaryPreferences.includes(option)}
                      onChange={handleDietaryChange}
                      className="w-5 h-5"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {dietaryPreferences.includes("Other") && (
                <input
                  type="text"
                  value={otherDietaryPreference}
                  onChange={(e) => setOtherDietaryPreference(e.target.value)}
                  placeholder="Specify other"
                  className="input mt-3 text-xl px-6 py-4 rounded-xl border-2 border-muted"
                />
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-lg font-semibold text-text-dark mb-3">
                Photos
              </label>
              <div className="border-4 border-dashed border-muted rounded-xl p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer text-primary hover:text-accent text-xl"
                >
                  Click to upload photos
                </label>
                {previewImages.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 text-2xl rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition"
            >
              Share Food
            </button>
          </form>
        </motion.div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-10 max-w-xl w-full text-center"
          >
            <h3 className="text-3xl font-bold mb-4">Thank You for Sharing!</h3>
            <p className="text-text-light text-xl">
              Your food listing has been created. Redirecting to your listings...
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default NewItem