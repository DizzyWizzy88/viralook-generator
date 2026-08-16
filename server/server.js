import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 *  Uses Gemini Flash to rewrite raw prompts, ensuring distinct spatial positions
 * and character traits to eliminate attribute blending in image generators.
 */
async function expandPromptWithGemini(userPrompt) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert image generation prompt engineer. Rewrite the following user prompt to improve accuracy.
Guidelines:
1. If multiple subjects/characters are present, give them explicit spatial placement (e. g. left, right, center) and distinct visual traits to avoid color/feature blending.
2. Keep the scene description vivid, concrete, and clear.
3. Return ONLY the rewritten prompt text without intro text, commentary, or quotes.

User Input: "${userPrompt}"`
        });

        return response.text?.trim() || userPrompt;
    } catch (err) {
        console.error("Gemini expansion error, using raw prompt:", err);
        return userPrompt;
    }
}

// Initialize Firebase Admin SDK (Set environment variables on Render)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();
const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://viralook-generator-2-uvh4.onrender.com'
];

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware to all routes and preflight OPTIONS requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200).send('Viralook API Server Active');
});

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, autoEnhance = true } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

        // Optionally expand prompt with Gemini
        const expandedPrompt = autoEnhance
            ? await expandPromptWithGemini(prompt)
            : prompt;

        // Combine with default style tags
        const finalEnhancedPromt = `${expandedPrompt}, hyper-realistic commercial studio presentation, dark aesthetic neon highlights, 8k resolution cinematic lighting`;
        
        // Call Fal.ai image generation
        const falResponse = await fetch("https://fal.run/fal-ai/flux/schnell", {
            method: "POST",
            headers: {
                "Authorization": `Key ${process.env.FAL_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringigy({
                prompt: finalEnhancedPrompt,
                image_size: "sqaure_hd",
            }),
        });

        const data = await falResponse.json();
        if (!falResponse.ok) {
            throw new Error(data.detail || "Fal.ai image generation failed");
        }
        
        const imageUrl = data.images[0].url;

        return res.json({
            imageUrl,
            originalPromt: prompt,
            expandedPrompt,
            finalEnhancedPrompt
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    };

    try {
        // 1. Verify User Firebase ID Token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'UNAUTHORIZED: MISSING TOKEN' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // 2. SERVER-SIDE CREDIT CHECK
        const userRef = db.collection('users').doc(uid);
        const userSnap = await userRef.get();
        const userData = userSnap.data() || {};
        const isLegend = userData.isUnlimited === true || userData.tier === 'legend';
        const credits = userData.credits || 0;

        if (!isLegend && credits <= 0) {
            return res.status(403).json({ error: 'OUT OF CREDITS' });
        }

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

        const finalEnhancedPrompt = `${prompt}, hyper-realistic commercial studio presentation, dark aesthetic neon highlights, 8k resolution cinematic lighting`;

        // 3. Call Fal.ai from the Server
        const falResponse = await fetch("https://fal.run/fal-ai/flux/schnell", {
            method: "POST",
            headers: {
                "Authorization": `Key ${process.env.FAL_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: finalEnhancedPrompt,
                image_size: "square_hd",
            }),
        });

        const data = await falResponse.json();

        if (!falResponse.ok || !data.images?.[0]?.url) {
            throw new Error(data.detail || data.error || "GENERATION FAILED");
        }

        const imageUrl = data.images[0].url;

        // 4. Record to Global Feed & Deduct Credit
        await db.collection('global_feed').add({
            prompt,
            enhancedPrompt: finalEnhancedPrompt,
            imageUrl,
            userId: uid,
            userEmail: decodedToken.email || "Anonymous",
            userName: decodedToken.name || "Anonymous Creator",
            createdAt: new Date().toISOString(),
            isPublic: true
        });

        if (!isLegend) {
            await userRef.update({ credits: admin.firestore.FieldValue.increment(-1) });
        }

        return res.json({ imageUrl, enhancedPrompt: finalEnhancedPrompt });
    } catch (err) {
        console.error("Server execution error:", err);
        return res.status(500).json({ error: err.message || "INTERNAL SERVER ERROR" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));