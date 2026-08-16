import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        let serviceAccount;

        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            // Handles raw JSON string set in Render environment variables
            serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string'
                ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
                : process.env.FIREBASE_SERVICE_ACCOUNT;
        } else if (process.env.FIREBASE_PROJECT_ID) {
            // Alternative: Using individual environment variables
            serviceAccount = {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            };
        }

        if (serviceAccount && serviceAccount.project_id || serviceAccount?.projectId) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log("Firebase Admin successfully initialized with Service Account.");
        } else {
            console.error("CRITICAL: FIREBASE_SERVICE_ACCOUNT environment variable is missing or invalid on Render.");
        }
    } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT credentials:", err.message);
    }
}

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Firebase Authentication Middleware
const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format.' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Firebase token verification error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid authentication token.' });
    }
};

// Health Check Endpoint (Required for Render)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Primary Asset Generation Endpoint
app.post('/api/generate', authenticateUser, async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return res.status(400).json({ error: 'A valid text prompt is required.' });
        }

        // Explicitly define finalEnhancedPrompt at top of route scope
        const rawPrompt = prompt.trim();

        // Optional: Pass rawPrompt through your prompt enhancement logic here
        const finalEnhancedPrompt = rawPrompt;

        console.log(`[GENERATE] Processing request for user: ${req.user.uid}`);
        console.log(`[GENERATE] Prompt: "${finalEnhancedPrompt}"`);

        // TODO: Call your external image generation API (e.g., Replicate, OpenAI, Stability)
        // Example placeholder image call:
        // const generatedImageUrl = await callImageGenerationApi(finalEnhancedPrompt);
        const output = await replicate.run("...", { input: { prompt: finalEnhancedPrompt } });
        const generatedImageUrl = Array.isArray(output) ? output[0] : output;

        return res.status(200).json({
            imageUrl: generatedImageUrl,
            enhancedPrompt: finalEnhancedPrompt,
            finalEnhancedPrompt: finalEnhancedPrompt,
        });
    } catch (error) {
        console.error('[GENERATE ERROR]:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error during asset synthesis.',
        });
    }
});

    

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});

app.listen(PORT, () => {
    console.log(`Server active on port ${PORT}`);
});