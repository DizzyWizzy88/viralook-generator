"use client";

import React from 'react';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';
import { getFirebaseAuth } from '@/lib/firebase'; 
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const auth = getFirebaseAuth();
      let isLoggedIn = false;

      if (Capacitor.isNativePlatform()) {
        // Native mobile login
        const result = await (SocialLogin as any).login({
          provider: 'google',
          options: {
            clientId: '994498276710-kriv0t2p1o82v59s7el0q65705u6kmgd.apps.googleusercontent.com',
            scopes: ['profile', 'email']
          },
        });

        const googleToken = result?.result?.token || result?.result?.idToken || (result?.result as any)?.token;
        if (googleToken) {
          const credential = GoogleAuthProvider.credential(googleToken);
          await signInWithCredential(auth, credential);
          isLoggedIn = true;
        }
      } else {
        // Browser login should use Firebase popup auth, not native redirect flow.
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        isLoggedIn = true;
      }

      if (isLoggedIn) {
        console.log("✅ Login Success!");
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070707] text-white p-6">
      <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-12">
        Viralook AI Studio
      </h1>
      <button 
        onClick={handleGoogleLogin} 
        className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-cyan-400 transition-all shadow-xl"
      >
        Sign in with Google
      </button>
    </div>
  );
}