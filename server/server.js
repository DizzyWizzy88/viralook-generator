import express from 'express';
import cors from 'cors';
import * as fal from '@fal-ai/serverless-client';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (assuming configuration is handled above)
if (!admin.apps.length) {
  admin.initializeApp();
  console.log("Firebase Admin successfully initialized.");
}

// 1. DEFINE FIREBASE AUTH MIDDLEWARE
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase Auth Verification Error:', error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

// 2. ROUTE HANDLER
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
      enable_safety_checker: true,
      num_images: 1,
    };

    console.log(`[FAL CALL] Sending payload to fal.ai:`, JSON.stringify(falInput, null, 2));

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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));