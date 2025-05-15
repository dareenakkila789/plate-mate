import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const postsCollectionRef = collection(db, "posts");

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
    <div className="main-content flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">Post New Food Item</h2>
        <input
          type="text"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
          className="input"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="input"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])} // Set the image file
          required
          className="input"
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          required
          className="input"
        />
        <div className="space-y-2">
          <p className="font-medium">Dietary Preferences:</p>
          {["Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "Other"].map((option) => (
            <label key={option} className="block">
              <input
                type="checkbox"
                value={option}
                checked={dietaryPreferences.includes(option)}
                onChange={handleDietaryChange}
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
          {dietaryPreferences.includes("Other") && (
            <input
              type="text"
              value={otherDietaryPreference}
              onChange={(e) => setOtherDietaryPreference(e.target.value)}
              placeholder="Specify other"
              className="input"
            />
          )}
        </div>
        <div>
          <label>Available From:</label>
          <input
            type="time"
            value={availabilityStartTime}
            onChange={(e) => setAvailabilityStartTime(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label>Available Until:</label>
          <input
            type="time"
            value={availabilityEndTime}
            onChange={(e) => setAvailabilityEndTime(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Post Food
        </button>
      </form>

      
    </div>
  );
};

export default NewItem;