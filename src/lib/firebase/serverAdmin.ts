// src/lib/firebase/serverAdmin.ts (SERVER-SIDE ONLY)
import * as admin from 'firebase-admin';

// The Service Account credentials are pulled securely from Vercel's Environment Variables
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // CRITICAL: Replace the escaped newline characters (\n) copied from the JSON file
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
};

// Initialize the app only once
if (!admin.apps.length) {
    // Check if the required keys are available before initialization
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        console.error("Firebase Admin SDK failed to initialize: Missing environment variables.");
    } else {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully.");
    }
}

// Export the initialized services
export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
