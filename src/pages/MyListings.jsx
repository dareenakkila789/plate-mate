import { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const MyListings = () => {
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const q = query(collection(db, "posts"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyItems(listings);
      } catch (err) {
        console.error("Error fetching my listings:", err);
      }
    };

    fetchMyListings();
  }, []);

  return (
    <div className="main-content flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Listings</h2>
        <Link to="/NewItem" className="bg-blue-500 text-white px-4 py-2 rounded">+ Add New Item</Link>
      </div>

      {myItems.length === 0 ? (
        <p>No items listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow">
              <img src={item.imageUrl} alt={item.foodName} className="h-40 w-full object-cover rounded" />
              <h3 className="font-semibold mt-2">{item.foodName}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-xs mt-1">Available: {item.availabilityStartTime} - {item.availabilityEndTime}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
