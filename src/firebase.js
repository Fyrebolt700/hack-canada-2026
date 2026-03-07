// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "hack-canada-2026.firebaseapp.com",
  projectId: "hack-canada-2026",
  storageBucket: "hack-canada-2026.firebasestorage.app",
  messagingSenderId: "613364990016",
  appId: "1:613364990016:web:9a419cbc12b220feaa1fa5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);