import React, { useState } from "react";
import { auth, provider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/login"); // Redirect to login page after signup
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/"); // Redirect to home page after Google signup
    } catch (err) {
      setError("An error occurred during Google signup. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-between">
          <span className="w-full border-b border-gray-300"></span>
          <span className="px-2 text-sm text-gray-500">or</span>
          <span className="w-full border-b border-gray-300"></span>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          <svg
            className="w-5 h-5 mr-2"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8c0-17.8-1.6-35-4.6-51.6H249v97.8h134.4c-5.8 31.4-23.2 58-49.4 75.8v62.9h79.8c46.6-43 73.2-106.3 73.2-184.9z"
            />
            <path
              fill="currentColor"
              d="M249 492c66.6 0 122.5-22 163.3-59.6l-79.8-62.9c-22.6 15.2-51.5 24.1-83.5 24.1-64.1 0-118.3-43.2-137.7-101.2H29.2v63.5C69.7 426.4 153.1 492 249 492z"
            />
            <path
              fill="currentColor"
              d="M111.3 292.4c-4.8-14.4-7.6-29.7-7.6-45.4s2.8-31 7.6-45.4v-63.5H29.2C10.5 171.2 0 208.1 0 246.9s10.5 75.7 29.2 108.8l82.1-63.3z"
            />
            <path
              fill="currentColor"
              d="M249 97.9c36.2 0 68.7 12.5 94.3 37l70.7-70.7C372.1 24.8 315.6 0 249 0 153.1 0 69.7 65.6 29.2 163.5l82.1 63.5C130.7 141.1 184.9 97.9 249 97.9z"
            />
          </svg>
          Sign up with Google
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
