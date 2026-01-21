import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// SAFETY CHECK: If we are building (server-side), don't initialize Firebase
const isBrowser = typeof window !== "undefined";

let app;
if (isBrowser) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} else {
    // Return a dummy object during build to prevent the "Invalid API Key" crash
    app = { name: "dummy" } as any;
}

export const auth = isBrowser ? getAuth(app) : {} as any;
export const db = isBrowser ? getFirestore(app) : {} as any;
export { app };
