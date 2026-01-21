// src/lib/server/authUtils.ts (SERVER-SIDE ONLY)
import { NextRequest } from 'next/server'; 
import { adminAuth } from '@/lib/firebase/serverAdmin'; 

/**
 * Verifies the Firebase ID token from the request headers.
 * This is the security gate for all privileged API routes.
 * * @param req The incoming Next.js API route request (NextRequest for App Router).
 * @returns The authenticated user's UID (string) or null if verification fails.
 */
export async function verifyIdToken(req: NextRequest): Promise<string | null> {
    const authHeader = req.headers.get('authorization');
    
    // 1. Check for valid Authorization header (must be 'Bearer <token>')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.warn('Missing or improperly formatted Authorization header.');
        return null;
    }

    // Extract the ID Token
    const idToken = authHeader.split('Bearer ')[1];

    try {
        // 2. Use the Firebase Admin SDK to verify the token's signature, expiry, and issuer
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        
        // 3. Return the user's unique ID (UID)
        return decodedToken.uid;
    } catch (error) {
        // This catches token errors like expired, invalid signature, etc.
        console.error('Error verifying Firebase ID Token:', error);
        return null;
    }
}
