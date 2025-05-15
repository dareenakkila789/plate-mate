import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { MapPin, Tag } from "lucide-react";

function Browse() {
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const navigate = useNavigate(); // For navigation to FoodItemPage

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

  return (
    <div className="main-content">
      <div className="browse-container">
        <h1 className="browse-title text-2xl font-bold mb-6">Browse Available Food</h1>

        {/* Food Grid */}
        <div className="food-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="food-card bg-white rounded-lg shadow-md p-4 cursor-pointer"
              onClick={() => navigate(`/food/${post.id}`)} // Navigate to FoodItemPage
            >
              {/* Food Image */}
              <img
                src={post.imageUrl}
                alt={post.foodName}
                className="food-image w-full h-48 object-cover rounded mb-4"
              />

              {/* Food Content */}
              <div className="food-content">
                <h3 className="food-title text-lg font-bold mb-2">{post.foodName}</h3>

                {/* Location */}
                <div className="food-location flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="location-icon h-4 w-4 mr-1" />
                  <span>{post.pickupLocation}</span>
                </div>

                {/* Dietary Preferences */}
                <div className="tag-container flex flex-wrap gap-2">
                  {post.dietaryPreferences &&
                    post.dietaryPreferences.map((tag, index) => (
                      <span
                        key={index}
                        className="tag bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center"
                      >
                        <Tag className="tag-icon h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Browse;