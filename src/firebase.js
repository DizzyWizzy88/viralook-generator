// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnaReQsnTgGMU_L5Q3a0S21GcBwG-PtSM",
  authDomain: "rapid-digit-480820-s5.firebaseapp.com",
  projectId: "rapid-digit-480820-s5",
  storageBucket: "rapid-digit-480820-s5.firebasestorage.app",
  messagingSenderId: "994498276710",
  appId: "1:994498276710:web:2a63fa6510a563a1816ca7",
  measurementId: "G-WKL3GX5FTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);