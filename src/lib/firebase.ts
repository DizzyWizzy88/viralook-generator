import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnaReQsnTgGMU_L5Q3a0S21GcBwG-PtSM",
  authDomain: "rapid-digit-480820-s5.firebaseapp.com", 
  projectId: "rapid-digit-480820-s5",
  storageBucket: "rapid-digit-480820-s5.firebasestorage.app",
  messagingSenderId: "994498276710",
  appId: "1:994498276710:web:d8dfbba34493390cc93e11"
};

// Initialize Firebase safely for SPA client-side reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/**
 * Syncs user auth profile to Firestore and automatically grants
 * "Viral Legend" status if the user matches your developer email.
 */
export async function syncUserData(user: any) {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  // Replace with your actual developer email address
  const IS_DEV_ACCOUNT = user.email === 'dr3930397@gmail.com';

  if (IS_DEV_ACCOUNT) {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        subscriptionTier: 'Viral Legend',
        isUnlimited: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true } // Preserves existing user fields while enforcing Viral Legend
    );
  } else if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      subscriptionTier: 'Free',
      isUnlimited: false,
      credits: 10,
      createdAt: serverTimestamp(),
    });
  }
}

// Explicit named exports matching your components' exact import statements
export function getFirebaseAuth() {
  return auth;
}

export function getFirebaseDb() {
  return db;
}

export { app, auth, db, storage };