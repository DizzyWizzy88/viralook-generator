import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { fal } from '@fal-ai/client';

dotenv.config();

// Auto-configures FAL_KEY from process.env.FAL_KEY
fal.config({
  credentials: process.env.FAL_KEY,
});

const app = express();
const PORT = process.env.PORT || 10000;

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string'
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : process.env.FIREBASE_SERVICE_ACCOUNT;
    } else if (process.env.FIREBASE_PROJECT_ID) {
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin successfully initialized.');
    }
  } catch (err) {
    console.error('Firebase Admin setup error:', err.message);
  }
}

app.use(cors({ origin: '*' }));
app.use(express.json());

// Auth Middleware
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token.' });
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
};

app.post('/api/generate', verifyFirebaseToken, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.uid;

  console.log(`\n================ GENERATION REQUEST ================`);
  console.log(`[GENERATE] Processing prompt for user: ${userId}`);
  console.log(`[GENERATE] Incoming Prompt: "${prompt}"`);

  try {
    // 1. Define input parameters explicitly
    const falInput = {
      prompt: prompt,
      image_size: "square_hd", // Ensure valid model size parameter
      enable_safety_checker: true,
      num_images: 1,
    };

    console.log(`[FAL CALL] Sending payload to fal.ai:`, JSON.stringify(falInput, null, 2));

    // 2. Execute fal.ai request
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: falInput,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log(`[FAL RESPONSE] Raw result payload:`, JSON.stringify(result, null, 2));

    // 3. Validate image output URL structure
    const imageUrl = result.images?.[0]?.url || result.image?.url;

    if (!imageUrl) {
      console.error(`[FAL ERROR] No image URL found in response structure.`);
      return res.status(500).json({ error: "No image URL returned from FAL model" });
    }

    console.log(`[FAL SUCCESS] Image generated: ${imageUrl}`);
    console.log(`===================================================\n`);

    return res.json({
      imageUrl,
      enhancedPrompt: result.prompt || prompt,
    });

  } catch (error) {
    console.error(`❌ [GENERATE ERROR] Exception during fal.ai request:`, error);
    return res.status(500).json({
      error: error.message || "Failed to generate asset via fal.ai",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server active on port ${PORT}`);
});