// src/lib/firebaseAdmin.ts
// This file is MOCKED for Static Export (Android/Capacitor)
// Admin logic should be handled via Firebase Cloud Functions, not on-device.

export const adminDb = null as any;
export const adminAuth = null as any;

const admin = {
  apps: [],
  initializeApp: () => {},
  credential: {
    cert: () => ({})
  },
  firestore: () => ({}),
  auth: () => ({})
} as any;

export default admin;
