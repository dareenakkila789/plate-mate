// import React, { useState } from "react";
// import { auth, provider } from "../config/firebase";
// import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { useNavigate, Link } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/"); // Redirect to home page after login
//     } catch (err) {
//       if (err.code === "auth/wrong-password") {
//         setError("Invalid password. Please try again.");
//       } else if (err.code === "auth/user-not-found") {
//         setError("No user found with this email.");
//       } else {
//         setError("An error occurred. Please try again.");
//       }
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       await signInWithPopup(auth, provider);
//       navigate("/"); // Redirect to home page after Google login
//     } catch (err) {
//       setError("An error occurred during Google login. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
//         <form onSubmit={handleLogin} className="space-y-4">
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
//             Login
//           </button>
//         </form>
//         <div className="flex items-center justify-between">
//           <span className="w-full border-b border-gray-300"></span>
//           <span className="px-2 text-sm text-gray-500">or</span>
//           <span className="w-full border-b border-gray-300"></span>
//         </div>
//         <button
//           onClick={handleGoogleLogin}
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
//           Sign in with Google
//         </button>
//         <p className="text-sm text-center text-gray-600">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { auth, provider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate,Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to home page after login
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Invalid password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/"); // Redirect to home page after Google login
    } catch (err) {
      setError("An error occurred during Google login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-lg md:text-xl lg:text-2xl">
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Left Section - Image and Quote */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative hidden md:flex md:w-1/2 bg-cover bg-center"
        >
          <img 
            src="https://images.pexels.com/photos/5677794/pexels-photo-5677794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="People sharing food"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative z-10 flex items-center justify-center h-full w-full text-white px-8">
  <blockquote className="text-3xl font-light italic text-center whitespace-nowrap">
    "A single plate can make someone's day."
  </blockquote>
</div>


        </motion.div>

        {/* Right Section - Login Form */}
        {/* Right Section - Login Form */} 
<motion.div 
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="flex-1 flex flex-col items-center justify-center py-4"
>
  {/* PlateMate Logo */}
  <Link 
    to="/" 
    className="text-5xl font-bold text-text-dark flex items-center gap-4 font-sans mb-6"
  >
    <UtensilsCrossed className="h-10 w-10 text-primary" />
    <span className="text-primary">Plate</span>
    <span>Mate</span>
  </Link>

  <div className="w-full max-w-3xl space-y-8">
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Welcome Back!
      </h1>
      <p className="text-gray-700 text-xl md:text-2xl">
        Sign in to share and receive meals in your community
      </p>
    </div>

    <form onSubmit={handleLogin} className="space-y-6 text-xl">
      <div className="space-y-2">
        <label htmlFor="email" className="block font-semibold text-gray-800 text-xl">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block font-semibold text-gray-800 text-xl">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-xl py-4 rounded-md transition-colors"
      >
        Login
      </button>
    </form>

    <div className="relative my-8">
      <hr />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="px-4 bg-white text-gray-500 text-lg">or</span>
      </div>
    </div>

    <button 
      onClick={handleGoogleLogin}
      className="w-full border border-gray-300 rounded-md py-4 text-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-4"
    >
      {/* Google Logo SVG */}
      <svg className="w-7 h-7" viewBox="0 0 48 48">
        <g>
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.23l6.9-6.9C36.2 2.1 30.5 0 24 0 14.8 0 6.7 5.1 2.7 12.6l8.1 6.3C13.2 13.1 18.2 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.7-2.1 5-4.4 6.6l7 5.4c4.1-3.8 6.5-9.3 6.5-16.5z"/>
          <path fill="#FBBC05" d="M10.8 28.9c-1.1-3.2-1.1-6.7 0-9.9l-8.1-6.3C.6 16.1 0 19 0 22c0 3 .6 5.9 1.7 8.6l9.1-7.7z"/>
          <path fill="#EA4335" d="M24 48c6.5 0 12-2.1 16-5.7l-7-5.4c-2 1.4-4.6 2.2-9 2.2-5.8 0-10.7-3.9-12.5-9.1l-9.1 7.7C6.7 42.9 14.8 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </g>
      </svg>
      Continue with Google
    </button>

    <p className="text-center text-gray-600 text-xl mt-6">
      Don't have an account?{' '}
      <Link 
        to="/signup" 
        className="text-primary hover:underline font-medium"
      >
        Sign up
      </Link>
    </p>
  </div>
</motion.div>

      </main>
    </div>
  );
}
