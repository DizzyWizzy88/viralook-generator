import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnaReQsnTgGMU_L5Q3a0S21GcBwG-PtSM",
  authDomain: "rapid-digit-480820-s5.firebaseapp.com",
  projectId: "rapid-digit-480820-s5",
  storageBucket: "rapid-digit-480820-s5.appspot.com",
  messagingSenderId: "994498276710",
  appId: "1:994498276710:web:2a63fa6510a563a1816ca7"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// These are the new clean names
export const db = getFirestore(app);
export const auth = getAuth(app);

// These are the "aliases" to fix your old files
export const getFirebaseDb = () => db;
export const getFirebaseAuth = () => auth;
