import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from './pages/Home';
import Browse from './pages/Browse'; 
import MyListings from './pages/MyListings';
import Profile from './pages/Profile'; 
import NewItem from './pages/NewItem';
import FoodItemDetails from './pages/FoodItemDetails';
import ProtectedRoute from './components/ProtectedRoutes';

import { auth } from './config/firebase'
import { Navigate } from 'react-router-dom';
import Header from './components/Header';

export default function App() {
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
      {user && <Header />} 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/browse" element={user ? <Browse /> : <Navigate to="/login" />} />
        <Route path="/my-listings" element={user ? <MyListings /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/NewItem" element={user ? <NewItem /> : <Navigate to="/NewItem" />} />
        <Route path="/food/:id" element={<FoodItemDetails />} />

        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}
