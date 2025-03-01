// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAVFtIjrNa4MFZsQg75qQm6oC0lvDjvalM",
  authDomain: "invenpulse-47b2e.firebaseapp.com",
  projectId: "invenpulse-47b2e",
  storageBucket: "invenpulse-47b2e.firebasestorage.app",
  messagingSenderId: "792930474863",
  appId: "1:792930474863:web:a21fa3ddc5129a2bd5e69a",
  measurementId: "G-6L7LJ996J9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);