import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnaReQsnTgGMU_L5Q3a0S21GcBwG-PtSM",
  // 💡 ADD THIS EXACT LINE RIGHT HERE:
  authDomain: "rapid-digit-480820-s5.firebaseapp.com", 
  projectId: "rapid-digit-480820-s5",
  storageBucket: "rapid-digit-480820-s5.firebasestorage.app",
  messagingSenderId: "994498276710",
  appId: "1:994498276710:web:d8dfbba34493390cc93e11" // Use your real app ID from Firebase console if known
};

// Initialize Firebase safely for SPA client-side reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Explicit named exports matching your components' exact import statements
export function getFirebaseAuth() {
  return auth;
}

export function getFirebaseDb() {
  return db;
}

export { app, auth, db, storage };