// File: src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web app Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnaReQsnTgGMU_L5Q3a0S21GcBwG-PtSM",
  authDomain: "rapid-digit-480820-s5.firebaseapp.com",
  projectId: "rapid-digit-480820-s5",
  storageBucket: "rapid-digit-480820-s5.firebasestorage.app",
  messagingSenderId: "994498276710",
  appId: "1:994498276710:web:d8dfbba34493390cc93e11"
};

// Initialize Firebase safely for client-side HMR reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/**
 * Syncs user auth profile to Firestore and automatically grants
 * "Viral Legend" status if the user matches your developer email.
 */
export async function syncUserData(user: User | null) {
  if (!user) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

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
        { merge: true }
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
  } catch (error) {
    console.error("🔥 Error syncing user data to Firestore:", error);
  }
}

export function getFirebaseAuth() {
  return auth;
}

export function getFirebaseDb() {
  return db;
}

export { app, auth, db, storage };