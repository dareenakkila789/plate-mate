import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCti_P4OOfeDad7uKV40KNJcm-xi7Nx81A",
  authDomain: "platemate-6c693.firebaseapp.com",
  projectId: "platemate-6c693",
  storageBucket: "platemate-6c693.firebasestorage.app",
  messagingSenderId: "383135992672",
  appId: "1:383135992672:web:5eb43bdccc41404a4bec05",
  measurementId: "G-VTMDNZ32YB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
