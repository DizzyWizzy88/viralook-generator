import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { fal } from '@fal-ai/client';

dotenv.config();

// Configure Fal credentials from environment variables
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
        }
    } catch (err) {
        console.error("Firebase Admin setup error:", err.message);
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

// Generation Endpoint via fal.ai
app.post('/api/generate', authenticateUser, async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return res.status(400).json({ error: 'A valid text prompt is required.' });
        }

        const finalEnhancedPrompt = prompt.trim();

        // Call Fal AI (using FLUX Schnell for fast, high-quality generation)
        const result = await fal.subscribe("fal-ai/flux/schnell", {
            input: {
                prompt: finalEnhancedPrompt,
                image_size: "square_hd",
                num_images: 1,
                enable_safety_checker: true
            },
            logs: true,
        });

        // Extract generated image URL
        const generatedImageUrl = result.data?.images?.[0]?.url;

        if (!generatedImageUrl) {
            throw new Error("No image URL received from fal.ai output.");
        }

        return res.status(200).json({
            imageUrl: generatedImageUrl,
            enhancedPrompt: finalEnhancedPrompt,
            finalEnhancedPrompt: finalEnhancedPrompt,
        });
    } catch (error) {
        console.error('[FAL AI ERROR]:', error);
        return res.status(500).json({
            error: error.message || 'Image generation failed via fal.ai.',
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});