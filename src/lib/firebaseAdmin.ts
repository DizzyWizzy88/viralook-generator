import * as admin from "firebase-admin";

export function getAdminDb() {
  if (!admin.apps.length) {
    try {
      // This fix specifically addresses the 'Digest' crash by 
      // ensuring the Private Key is formatted correctly for Vercel.
      const privateKey = process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined;

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log("Firebase Admin Initialized Successfully");
    } catch (error) {
      console.error("Firebase Admin Initialization Error:", error);
      return null;
    }
  }
  return admin.firestore();
}
