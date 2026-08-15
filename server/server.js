// server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// 1. Initialize Firebase Admin using discrete environment variables or fallback JSON
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Option A: Full JSON string
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
  // Option B: Individual Render Env Vars
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  });
} else {
  // Option C: Local Default Credentials
  admin.initializeApp();
}

const db = admin.firestore();
const app = express();

// 2. Comprehensive CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://viralook-generator-2.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback allow during dev
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Explicit Preflight Handling
app.options('*', cors());

app.use(express.json());

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).send('Viralook API Server Active');
});

app.post('/api/generate', async (req, res) => {
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

    // 3. Call Fal.ai from the Server (FAL_KEY hidden)
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