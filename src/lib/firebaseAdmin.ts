import admin from "firebase-admin";

// Use a helper to check if we're in a build environment or missing keys
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // The .replace() is vital for Vercel newline handling
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  // Only initialize if we actually have the required keys
  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin Initialized");
    } catch (error) {
      console.error("❌ Firebase Admin Init Error:", error);
    }
  } else {
    console.warn("⚠️ Firebase Admin credentials missing. Skipping init (Normal during build).");
  }
}

export const adminDb = admin.firestore();
