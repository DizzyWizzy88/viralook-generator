// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/server/authUtils';
import { adminFirestore } from '@/lib/firebase/serverAdmin';
import axios from 'axios';

// The endpoint will be /api/generate
export async function POST(req: NextRequest) {
    // 1. INPUT VALIDATION (Early Exit)
    let prompt: string;
    try {
        const body = await req.json();
        prompt = body.prompt;
        if (!prompt || typeof prompt !== 'string' || prompt.length < 5) {
            return NextResponse.json({ message: 'Invalid prompt provided.' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
    }

    // 2. AUTHENTICATION (Security Gate)
    const userId = await verifyIdToken(req);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized: Invalid or missing token.' }, { status: 401 });
    }
    
    const userDocRef = adminFirestore.collection('users').doc(userId);
    const ONE_CREDIT = 1;

    let imageUrl = '';

    // 3. TRANSACTIONAL LOGIC (Credit Check and Deduction)
    try {
        await adminFirestore.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userDocRef);

            if (!userDoc.exists) {
                throw new Error('User profile not found.');
            }

            const currentCredits = userDoc.data()?.creditCount || 0;

            if (currentCredits < ONE_CREDIT) {
                // Throw an error that the client can catch
                throw new Error('Insufficient credits.');
            }

            // DEDUCT THE CREDIT
            const newCredits = currentCredits - ONE_CREDIT;
            transaction.update(userDocRef, { 
                creditCount: newCredits,
                lastUsed: adminFirestore.FieldValue.serverTimestamp() 
            });

            // 4. CORE LOGIC (Call External AI API)
            // This is run *inside* the transaction for conceptual safety, 
            // though in production, you might structure this differently (e.g., using a queue)
            // to ensure the external API call is not holding up the Firestore transaction.

            const aiApiKey = process.env.AI_API_KEY; // Pulled securely from Vercel

            // Example call to a placeholder AI service
            const aiResponse = await axios.post(
                'https://api.external-ai.com/generate', 
                { prompt: prompt, user: userId },
                {
                    headers: {
                        'Authorization': `Bearer ${aiApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Assuming the AI API returns the image URL directly
            imageUrl = aiResponse.data.imageUrl;
            
            // Note: If the AI API fails *before* returning, the transaction is automatically rolled back 
            // because of the unhandled exception, and the credit is not deducted.

        });
        
        // 5. SUCCESS RESPONSE
        return NextResponse.json({ imageUrl: imageUrl, message: 'Generation successful.' }, { status: 200 });
        
    } catch (error: any) {
        console.error('AI Generation API Route Error:', error.message);
        
        // Handle specific errors for user feedback
        if (error.message === 'Insufficient credits.') {
            return NextResponse.json({ message: 'Error: Not enough credits.' }, { status: 403 });
        }
        if (error.message === 'User profile not found.') {
            return NextResponse.json({ message: 'Error: User profile missing.' }, { status: 404 });
        }

        // Catch-all for other errors (AI API failed, Firestore transaction failed, etc.)
        return NextResponse.json({ message: 'Internal Server Error during generation.' }, { status: 500 });
    }
}
