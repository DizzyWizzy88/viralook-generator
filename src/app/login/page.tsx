"use client";

import React from 'react';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase'; 
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      // 1. Trigger the NATIVE Android Google Picker
      const result = await (SocialLogin as any).login({
        provider: 'google',
        options: {
          clientId: '994498276710-kriv0t2p1o82v59s7el0q65705u6kmgd.apps.googleusercontent.com',
          scopes: ['profile', 'email']
        },
      });

      // ✅ THE FIX: @ts-ignore tells the compiler to shut its eyes for the next line
      // @ts-ignore
      const googleToken = result.result?.idToken || result.result?.token || (result.result as any)?.token;

      if (googleToken) {
        const auth = getFirebaseAuth();
        const credential = GoogleAuthProvider.credential(googleToken);
        const authResult = await signInWithCredential(auth, credential);
        const user = authResult.user;
        
        // Create user in Firestore if they don't exist
        const db = getFirebaseDb();
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            credits: 2,
            createdAt: serverTimestamp(),
            isUnlimited: false
          });
        }
        
        console.log("✅ Native Login Success!");
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070707] text-white">
      <button onClick={handleGoogleLogin} className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[11px]">
        Sign in with Google
      </button>
    </div>
  );
}