"use client";
export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSocialLogin = async (providerType: 'google' | 'github') => {
    if (typeof window === "undefined") return; 
    setSocialLoading(providerType);
    const auth = getAuth(app);
    const provider = providerType === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-black mb-8">VIRALOOK</h1>
      <div className="w-full max-w-[320px] space-y-4">
        <button onClick={() => handleSocialLogin('google')} className="w-full h-[50px] bg-white text-black font-bold rounded-full">
          {socialLoading === 'google' ? "LOADING..." : "GOOGLE LOGIN"}
        </button>
      </div>
    </div>
  );
}
