import express from 'express';
import cors from 'cors';
import { fal } from '@fal-ai/client';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin if not already active
if (!admin.apps.length) {
  admin.initializeApp();
}

// Middleware: Verify ID Token
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
    console.error('Firebase Auth Error:', error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
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