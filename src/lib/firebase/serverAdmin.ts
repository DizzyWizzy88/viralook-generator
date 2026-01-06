import * as admin from "firebase-admin";

/**
 * Singleton pattern for Firebase Admin to prevent multiple 
 * initializations during Hot Module Replacement (HMR) in Next.js.
 */
const initializeAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Formatting the private key for Vercel/Production
  // In your .env, the key often contains escaped newlines (\n) 
  // that need to be converted to actual newline characters.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    // Required for credit validation and "Viral Legend" database triggers
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
};

// Initialize the app
const adminApp = initializeAdmin();

// Export the specific services needed for credit management
export const adminDb = adminApp.firestore();
export const adminAuth = adminApp.auth();

// Export FieldValue for atomic credit decrements (e.g., FieldValue.increment(-1))
export const FieldValue = admin.firestore.FieldValue;

export default adminApp;
