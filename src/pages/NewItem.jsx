import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { db, auth } from "../config/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";

const NewItem = () => {
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [pickupDate, setPickupDate] = useState(""); // Changed to empty string for no default
  const [pickupLocation, setPickupLocation] = useState("");
  const [category, setCategory] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [otherDietaryPreference, setOtherDietaryPreference] = useState("");
  const [availabilityStartTime, setAvailabilityStartTime] = useState("");
  const [availabilityEndTime, setAvailabilityEndTime] = useState("");
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const postsCollectionRef = collection(db, "posts");

  const dietaryOptions = [
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Other",
  ];

  const categoryOptions = [
    { value: "", label: "Select category" },
    { value: "baked", label: "Baked Goods" },
    { value: "cooked", label: "Cooked Meals" },
    { value: "fruits", label: "Fruits & Vegetables" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getDocs(postsCollectionRef);
        const postsData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDietaryChange = (e) => {
    const { value, checked } = e.target;

    setDietaryPreferences((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 800;
          const scaleSize = maxWidth / img.width;

          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          resolve(compressedBase64);
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const file = files[0];

    try {
      const compressedImage = await compressImage(file);
      setImageBase64(compressedImage);
      setPreviewImages([compressedImage]);
    } catch (err) {
      console.error("Error processing image:", err);
      alert("Failed to process image.");
    }
  };

  const removeImage = () => {
    setPreviewImages([]);
    setImageBase64("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to share food. Please sign in.");
      return;
    }

    if (!imageBase64) {
      alert("Please select an image for your food item.");
      return;
    }

    if (!category) {
      alert("Please select a food category.");
      return;
    }

    if (!pickupDate || !availabilityStartTime || !availabilityEndTime) {
      alert("Please set pickup date and time.");
      return;
    }

    const fromDateTime = new Date(`${pickupDate}T${availabilityStartTime}`);
    const untilDateTime = new Date(`${pickupDate}T${availabilityEndTime}`);

    if (fromDateTime >= untilDateTime) {
      alert("Available until time must be after available from time.");
      return;
    }

    if (expiryDate && new Date(pickupDate) > new Date(expiryDate)) {
      alert("Pickup date must be on or before the expiry date.");
      return;
    }

    try {
      await addDoc(postsCollectionRef, {
        foodName,
        description,
        expiryDate,
        pickupDate,
        pickupLocation,
        category,
        dietaryPreferences: dietaryPreferences.includes("Other")
          ? [
              ...dietaryPreferences.filter((p) => p !== "Other"),
              otherDietaryPreference,
            ]
          : dietaryPreferences,
        availabilityStartTime,
        availabilityEndTime,
        userId,
        imageUrl: imageBase64,
        isAvailable: true,
        createdAt: new Date().toISOString(),
      });

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/profile");
      }, 2000);

      setFoodName("");
      setDescription("");
      setImageBase64("");
      setExpiryDate("");
      setPickupDate(""); // Reset to empty
      setPickupLocation("");
      setCategory("");
      setDietaryPreferences([]);
      setOtherDietaryPreference("");
      setAvailabilityStartTime("");
      setAvailabilityEndTime("");
      setPreviewImages([]);

      const data = await getDocs(postsCollectionRef);
      const postsData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Failed to share food. Please try again. Error: " + err.message);
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
            <div>
              <label
                htmlFor="name"
                className="block text-base font-semibold text-text-dark mb-2"
              >
                Food Name *
              </label>

              <input
                type="text"
                id="name"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-muted"
                placeholder="e.g., Homemade Chocolate Cake"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-lg font-semibold mb-2"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-6 py-4 rounded-xl border-2 border-muted"
                placeholder="Tell us more about the food"
              />
            </div>

            <div>
              <label
                htmlFor="pickupLocation"
                className="block text-lg font-semibold mb-2"
              >
                Pickup Location *
              </label>

              <select
                id="pickupLocation"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-muted"
              >
                <option value="">Select a district</option>
                {Array.from({ length: 22 }, (_, i) => (
                  <option key={i + 1} value={`District ${i + 1}`}>
                    District {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-lg font-semibold mb-2"
              >
                Food Category *
              </label>

              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-muted"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="expiryDate"
                className="block text-lg font-semibold mb-2"
              >
                Best Before *
              </label>

              <input
                type="date"
                id="expiryDate"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-6 py-4 rounded-xl border-2 border-muted"
              />
            </div>

            <div>
              <label
                htmlFor="pickupDate"
                className="block text-lg font-semibold mb-2"
              >
                Pickup Date *
              </label>

              <input
                type="date"
                id="pickupDate"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-6 py-4 rounded-xl border-2 border-muted"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Available From *
              </label>

              <input
                type="time"
                value={availabilityStartTime}
                onChange={(e) => setAvailabilityStartTime(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-xl border-2 border-muted"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Available Until *
              </label>

              <input
                type="time"
                value={availabilityEndTime}
                onChange={(e) => setAvailabilityEndTime(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-xl border-2 border-muted"
              />

              <p className="text-sm text-gray-500 mt-1">
                Pickup is available on the selected date during this time window.
              </p>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3">
                Dietary Information
              </label>

              <div className="flex flex-wrap gap-4">
                {dietaryOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      value={option}
                      checked={dietaryPreferences.includes(option)}
                      onChange={handleDietaryChange}
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
                  className="mt-3 w-full px-6 py-4 rounded-xl border-2 border-muted"
                />
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3">
                Photos
              </label>

              <div className="border-4 border-dashed border-muted rounded-xl p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                />

                <label
                  htmlFor="images"
                  className="cursor-pointer text-primary hover:text-accent text-xl"
                >
                  Click to upload photo
                </label>

                {previewImages.length > 0 && (
                  <div className="mt-6">
                    <div className="relative inline-block">
                      <img
                        src={previewImages[0]}
                        alt="Preview"
                        className="w-64 h-40 object-cover rounded-xl"
                      />

                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 text-2xl rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition"
            >
              Share Food
            </button>
          </form>
        </motion.div>
      </div>

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
            <h3 className="text-3xl font-bold mb-4">
              Thank You for Sharing!
            </h3>

            <p className="text-text-light text-xl">
              Your food listing has been created. Redirecting to your profile...
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NewItem;