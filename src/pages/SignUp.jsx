// import React, { useState } from "react";
// import { auth, provider } from "../config/firebase";
// import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// export default function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       alert("Account created successfully!");
//       navigate("/login"); // Redirect to login page after signup
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleGoogleSignup = async () => {
//     try {
//       await signInWithPopup(auth, provider);
//       navigate("/"); // Redirect to home page after Google signup
//     } catch (err) {
//       setError("An error occurred during Google signup. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
//         <form onSubmit={handleSignup} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-4 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           {error && <p className="text-sm text-red-600">{error}</p>}
//           <button
//             type="submit"
//             className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Sign Up
//           </button>
//         </form>

//         <div className="flex items-center justify-between">
//           <span className="w-full border-b border-gray-300"></span>
//           <span className="px-2 text-sm text-gray-500">or</span>
//           <span className="w-full border-b border-gray-300"></span>
//         </div>

//         <button
//           onClick={handleGoogleSignup}
//           className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
//         >
//           <svg
//             className="w-5 h-5 mr-2"
//             aria-hidden="true"
//             focusable="false"
//             data-prefix="fab"
//             data-icon="google"
//             role="img"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 488 512"
//           >
//             <path
//               fill="currentColor"
//               d="M488 261.8c0-17.8-1.6-35-4.6-51.6H249v97.8h134.4c-5.8 31.4-23.2 58-49.4 75.8v62.9h79.8c46.6-43 73.2-106.3 73.2-184.9z"
//             />
//             <path
//               fill="currentColor"
//               d="M249 492c66.6 0 122.5-22 163.3-59.6l-79.8-62.9c-22.6 15.2-51.5 24.1-83.5 24.1-64.1 0-118.3-43.2-137.7-101.2H29.2v63.5C69.7 426.4 153.1 492 249 492z"
//             />
//             <path
//               fill="currentColor"
//               d="M111.3 292.4c-4.8-14.4-7.6-29.7-7.6-45.4s2.8-31 7.6-45.4v-63.5H29.2C10.5 171.2 0 208.1 0 246.9s10.5 75.7 29.2 108.8l82.1-63.3z"
//             />
//             <path
//               fill="currentColor"
//               d="M249 97.9c36.2 0 68.7 12.5 94.3 37l70.7-70.7C372.1 24.8 315.6 0 249 0 153.1 0 69.7 65.6 29.2 163.5l82.1 63.5C130.7 141.1 184.9 97.9 249 97.9z"
//             />
//           </svg>
//           Sign up with Google
//         </button>

//         <p className="text-sm text-center text-gray-600">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  confirmPassword: "",
  agreeToTerms: false,
});

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Save full name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
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

        {/* Right Section - Signup Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-[1.3] flex flex-col items-center justify-center h-full pt-4 pb-4"
        >
          <Link to="/" className="text-5xl font-bold text-text-dark flex items-center gap-4 font-sans mb-6">
            <UtensilsCrossed className="h-10 w-10 text-primary" />
            <span className="text-primary">Plate</span><span>Mate</span>
          </Link>

          <div className="w-full max-w-2xl space-y-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Join us!</h1>
              <p className="text-gray-700 text-xl md:text-2xl">Create an account to start sharing and receiving meals</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xl">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-base font-medium text-gray-700">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A3D9A5] focus:border-[#A3D9A5]"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-base font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A3D9A5] focus:border-[#A3D9A5]"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-base font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A3D9A5] focus:border-[#A3D9A5]"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A3D9A5] focus:border-[#A3D9A5]"
                  placeholder="••••••••"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-5 w-5 text-[#7BAE7D] border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="text-lg text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#7BAE7D] hover:underline text-lg">Terms of Service</Link> and{" "}
                  <Link to="/privacy" className="text-[#7BAE7D] hover:underline text-lg">Privacy Policy</Link>
                </label>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={!formData.agreeToTerms}
                className={`w-full text-white font-semibold text-xl py-3 rounded-md transition-colors ${
                  formData.agreeToTerms
                    ? 'bg-[#A3D9A5] hover:bg-[#7BAE7D]'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <hr />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 bg-white text-gray-500 text-base">or</span>
              </div>
            </div>

            {/* Google Signup */}
            <button
              onClick={handleGoogleSignup}
              className="w-full border border-gray-300 rounded-md py-3 text-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
            >
              {/* Google Icon */}
              <svg className="w-7 h-7" viewBox="0 0 48 48"><g><path fill="#4285F4" d="..."/></g></svg>
              Sign Up with Google
            </button>

            <p className="text-center text-gray-600 text-lg mt-4">
              Already have an Account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
