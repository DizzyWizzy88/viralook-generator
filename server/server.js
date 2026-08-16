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
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
        }
    } catch (err) {
        console.warn("Firebase Admin failed to initialize with credentials. Falling back to default init:", err.message);
        admin.initializeApp();
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
        const mockImageUrl = `https://picsum.photos/seed/${encodeURIComponent(finalEnhancedPrompt)}/1024/1024`;

        return res.status(200).json({
            imageUrl: mockImageUrl,
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