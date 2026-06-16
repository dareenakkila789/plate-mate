import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms.");
      return;
    }

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Update Firebase Auth display name
      await updateProfile(user, {
        displayName: formData.name,
      });

      // Save extra user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.name,
        email: formData.email,
        location: formData.location,
        createdAt: serverTimestamp(),
        profileImage: "",
        listingsCount: 0,
        completedPickups: 0,
        averageRating: 0,   // add this
  totalRatings: 0,    
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create Firestore user document if first signup
      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: user.displayName || "",
          email: user.email,
          location: "",
          createdAt: serverTimestamp(),
          profileImage: user.photoURL || "",
          listingsCount: 0,
          completedPickups: 0,
        },
        { merge: true }
      );

      navigate("/");
    } catch (err) {
      setError("An error occurred during Google signup. Please try again.");
    }
  };

  return (
    <div className="min-h-screen h-screen bg-white flex flex-col overflow-hidden">
      <main className="flex-grow flex flex-col md:flex-row h-full">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative hidden md:flex md:w-1/2 h-full bg-cover bg-center"
        >
          <img
            src="https://images.pexels.com/photos/5677797/pexels-photo-5677797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Community sharing food"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative z-10 flex items-center justify-center h-full w-full p-8 text-white">
            <blockquote className="text-2xl font-light italic text-left max-w-lg w-full">
              "Join a community of neighbors helping neighbors through food."
            </blockquote>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-[1.3] flex flex-col items-center justify-center h-full pt-4 pb-4 px-6"
        >
          <Link
            to="/"
            className="text-5xl font-bold flex items-center gap-4 mb-6"
          >
            <UtensilsCrossed className="h-10 w-10 text-[#7BAE7D]" />
            <span className="text-[#7BAE7D]">Plate</span>
            <span className="text-gray-900">Mate</span>
          </Link>

          <div className="w-full max-w-2xl space-y-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Join us!
              </h1>
              <p className="text-gray-700 text-xl">
                Create an account to start sharing and receiving meals
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#A3D9A5]"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Location
                </label>
                <input
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#A3D9A5]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#A3D9A5]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#A3D9A5]"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#A3D9A5]"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <label className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#7BAE7D] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-[#7BAE7D] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={!formData.agreeToTerms}
                className={`w-full py-3 rounded-md text-white font-semibold text-lg ${
                  formData.agreeToTerms
                    ? "bg-[#A3D9A5] hover:bg-[#7BAE7D]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <hr />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google Signup */}
            <button
              onClick={handleGoogleSignup}
              className="w-full border border-gray-300 rounded-md py-3 font-semibold hover:bg-gray-100 transition"
            >
              Sign Up with Google
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#7BAE7D] hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}