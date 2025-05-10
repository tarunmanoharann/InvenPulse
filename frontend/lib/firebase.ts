import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVFtIjrNa4MFZsQg75qQm6oC0lvDjvalM",
  authDomain: "invenpulse-47b2e.firebaseapp.com",
  projectId: "invenpulse-47b2e",
  storageBucket: "invenpulse-47b2e.firebasestorage.app",
  messagingSenderId: "792930474863",
  appId: "1:792930474863:web:a21fa3ddc5129a2bd5e69a",
  measurementId: "G-6L7LJ996J9"
};

// Initialize Firebase for the client
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth and Firestore can only be used on the client side
let auth = null;
let db = null;
let analytics = null;

// Only initialize these on the client
if (typeof window !== 'undefined') {
  auth = getAuth(firebase_app);
  db = getFirestore(firebase_app);
  analytics = getAnalytics(firebase_app);
}

export { firebase_app, auth, db, analytics }; 