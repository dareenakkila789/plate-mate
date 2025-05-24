// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./components/Login";
// import SignUp from "./components/SignUp";
// import Home from './pages/Home';
// import Browse from './pages/Browse'; 
// import MyListings from './pages/MyListings';
// import Profile from './pages/Profile'; 
// import NewItem from './pages/NewItem';
// import FoodItemDetails from './pages/FoodItemDetails';
// import ProtectedRoute from './components/ProtectedRoutes';

// import { auth } from './config/firebase'
// import { Navigate } from 'react-router-dom';
// import Header from './components/Header';

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       setUser(currentUser);
//       setLoading(false); 
//     });

//     return () => unsubscribe(); // Cleanup subscription
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <Router>
//       {user && <Header />} 
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
        
//         {/* Protected Routes */}
//         <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
//         <Route path="/browse" element={user ? <Browse /> : <Navigate to="/login" />} />
//         <Route path="/my-listings" element={user ? <MyListings /> : <Navigate to="/login" />} />
//         <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
//         <Route path="/NewItem" element={user ? <NewItem /> : <Navigate to="/NewItem" />} />
//         <Route path="/food/:id" element={<FoodItemDetails />} />

//         <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
//       </Routes>
//     </Router>
//   );
// }
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router,Routes, Route,  } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Browse from './pages/Browse'
import MyListings from './pages/MyListings'
import FoodDetails from './pages/FoodDetails'
import NewItem from './pages/NewItem'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoutes';

import { auth } from './config/firebase'
import { Navigate } from 'react-router-dom';
import Header from './components/Header';

function App() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'request',
      title: 'New request for your homemade lasagna',
      message: 'Sarah would like to pick up your homemade lasagna',
      createdAt: new Date('2025-04-20T10:30:00'),
      isRead: false,
    },
    {
      id: 2,
      type: 'accepted',
      title: 'Request accepted!',
      message: 'Michael accepted your request for chocolate cake',
      createdAt: new Date('2025-04-19T16:45:00'),
      isRead: true,
    },
    {
      id: 3,
      type: 'rejected',
      title: 'Request declined',
      message: 'Lisa declined your request for vegetable curry',
      createdAt: new Date('2025-04-18T14:20:00'),
      isRead: false,
    },
    {
      id: 4,
      type: 'request',
      title: 'New request for your apple pie',
      message: 'John would like to pick up your apple pie tomorrow',
      createdAt: new Date('2025-04-17T09:15:00'),
      isRead: false,
    }
  ])
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ))
  }
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })))
  }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <Router>
<Header
  user={user}
  notifications={notifications}
  markAsRead={markAsRead}
  markAllAsRead={markAllAsRead}
/>
    <Routes>
      <Route path="/" element={<Home user={user}/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/browse" element={<Browse user={user} />} />
      <Route path="/my-listings" element={<MyListings />} />
      <Route path="/food/:id" element={<FoodDetails />} />
      <Route path="/new-item" element={<NewItem />} />
      <Route path="/about" element={<div>About Page (Coming Soon)</div>} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

    </Routes>
    </Router>
  )
}

export default App