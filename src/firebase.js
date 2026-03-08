import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "hack-canada-2026.firebaseapp.com",
    projectId: "hack-canada-2026",
    storageBucket: "hack-canada-2026.firebasestorage.app",
    messagingSenderId: "613364990016",
    appId: "1:613364990016:web:9a419cbc12b220feaa1fa5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const functions = getFunctions(app);