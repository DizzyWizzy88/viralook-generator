import express from 'express';
import cors from 'cors';
import { fal } from '@fal-ai/client';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Option A: Service account via individual env variables
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines if passed as a string in Render
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log(`Firebase Admin initialized for project: ${process.env.FIREBASE_PROJECT_ID}`);
  } 
  // Option B: Service account via single JSON string env variable
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log(`Firebase Admin initialized for project: ${serviceAccount.project_id}`);
  } 
  else {
    admin.initializeApp();
    console.log("Firebase Admin initialized with default credentials.");
  }
}

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    // Detailed error logging to diagnose the mismatch
    console.error('❌ Firebase Auth Verification Error Details:', {
      code: error.code,
      message: error.message,
    });

    return res.status(403).json({ 
      error: `Unauthorized: ${error.message || 'Invalid token'}` 
    });
  }
};

app.post('/api/generate', verifyFirebaseToken, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.uid;

  console.log(`\n================ GENERATION REQUEST ================`);
  console.log(`[GENERATE] Processing prompt for user: ${userId}`);
  console.log(`[GENERATE] Incoming Prompt: "${prompt}"`);

  try {
    const falInput = {
      prompt: prompt,
      image_size: "square_hd",
      num_images: 1,
      enable_safety_checker: true,
    };

    console.log(`[FAL CALL] Sending payload to fal.ai:`, JSON.stringify(falInput, null, 2));

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: falInput,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach((log) => console.log(`[FAL LOG] ${log.message}`));
        }
      },
    });

    console.log(`[FAL RESPONSE] Raw result payload:`, JSON.stringify(result, null, 2));

    const imageUrl = result.data?.images?.[0]?.url || result.images?.[0]?.url || result.image?.url;

    if (!imageUrl) {
      console.error(`[FAL ERROR] No image URL found in response structure.`);
      return res.status(500).json({ error: "No image URL returned from FAL model" });
    }

    console.log(`[FAL SUCCESS] Image generated: ${imageUrl}`);
    console.log(`===================================================\n`);

    return res.json({
      imageUrl,
      enhancedPrompt: result.data?.prompt || prompt,
    });

  } catch (error) {
    console.error(`❌ [GENERATE ERROR] Exception during fal.ai request:`, error);
    return res.status(500).json({
      error: error.message || "Failed to generate asset via fal.ai",
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));