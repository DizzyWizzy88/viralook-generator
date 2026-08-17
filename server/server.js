import express from 'express';
import cors from 'cors';
import { fal } from '@fal-ai/client';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (ONCE)
if (!admin.apps.length) {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log(`Firebase Admin initialized for project: ${process.env.FIREBASE_PROJECT_ID}`);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log(`Firebase Admin initialized for project: ${serviceAccount.project_id}`);
  } else {
    admin.initializeApp();
    console.log("Firebase Admin initialized with default credentials.");
  }
}

// Middleware: Verify Token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase Auth Verification Error:', error.message);
    return res.status(403).json({ error: `Unauthorized: ${error.message}` });
  }
};

// Route
app.post('/api/generate', verifyFirebaseToken, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.uid;

  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: prompt,
        image_size: "square_hd",
        num_images: 1,
        enable_safety_checker: true,
      },
    });

    const imageUrl = result.data?.images?.[0]?.url || result.images?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ error: "No image URL returned from FAL model" });
    }

    return res.json({ imageUrl });
  } catch (error) {
    console.error("FAL Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));