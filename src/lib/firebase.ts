import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnNtvhCLZ6tXtVdTCbgfUdbjuq7h-WAcQ",
  authDomain: "rapid-digit-480820-s5.firebaseapp.com",
  projectId: "rapid-digit-480820-s5",
  storageBucket: "rapid-digit-480820-s5.firebasestorage.app",
  messagingSenderId: "994498276710",
  appId: "1:994498276710:android:671a39e364929e43816ca7"
};

// 1. Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);

// 3. Set persistence to browser local storage (prevents sessionStorage issues)
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(err => {
    console.warn('Failed to set Firebase persistence:', err);
  });
}

// 4. Exports
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
export { app, auth, db };
