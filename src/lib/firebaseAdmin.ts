import * as admin from "firebase-admin";

export function getAdminDb() {
  if (!admin.apps.length) {
    try {
      // 1. Log to Vercel logs to see which one is missing (DO NOT log the private key)
      console.log("Initializing Firebase with:", {
        projectId: process.env.FIREBASE_PROJECT_ID ? "PRESENT" : "MISSING",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? "PRESENT" : "MISSING",
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? "PRESENT" : "MISSING",
      });

      const privateKey = process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined;

      // 2. Explicitly build the object to ensure types are correct
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      };

      // 3. Check if any are missing before calling cert()
      if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error("Missing one or more Firebase Environment Variables");
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
    } catch (error) {
      console.error("Firebase Admin Initialization Error:", error);
      return null;
    }
  }
  return admin.firestore();
}
