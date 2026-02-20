import admin from "firebase-admin";

const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  // Only init if we are NOT in the build worker
  if (serviceAccount.projectId && serviceAccount.privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  
  return null;
};

// Instead of exporting a constant 'db', export a function
export const getAdminDb = () => {
  const app = initAdmin();
  if (!app) {
    // During build, this might be null. We return a proxy or null 
    // to prevent the "Default app does not exist" crash.
    return null as any; 
  }
  return admin.firestore();
};
