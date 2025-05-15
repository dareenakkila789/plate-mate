import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

function FoodItemDetails() {
  const { id } = useParams();
  const [foodItem, setFoodItem] = useState(null);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFoodItem({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such document!");
        }
      } catch (err) {
        console.error("Error fetching food item:", err);
      }
    };

    fetchFoodItem();
  }, [id]);

  if (!foodItem) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  return (
    <div className="pt-24 pb-10 px-4 min-h-screen bg-gray-100 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
        {/* Food Image */}
        <img
          src={foodItem.imageUrl}
          alt={foodItem.foodName}
          className="w-full h-80 object-cover"
        />

        {/* Food Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {foodItem.foodName}
          </h1>
          <p className="text-gray-700 text-base mb-6 leading-relaxed">
            {foodItem.description}
          </p>

          {/* Location */}
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-semibold">Pickup Location:</span>{" "}
            {foodItem.pickupLocation}
          </p>

          {/* Dietary Preferences */}
          {foodItem.dietaryPreferences && foodItem.dietaryPreferences.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 font-semibold mb-2">Dietary Preferences:</p>
              <div className="flex flex-wrap gap-2">
                {foodItem.dietaryPreferences.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Available From:</span>{" "}
            {foodItem.availabilityStartTime} - {foodItem.availabilityEndTime}
          </p>

          {/* Expiry Date */}
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Expires on:</span>{" "}
            {foodItem.expiryDate}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FoodItemDetails;
