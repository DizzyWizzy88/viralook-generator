"use client";

import React, { useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  signInWithCredential
} from 'firebase/auth';
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';
import { useSummoningSequence } from '@/hooks/useSummoningSequence';
import {
  Sparkles,
  Zap,
  AlertCircle,
  RefreshCw,
  Wand2,
  LogIn,
  Lock,
  Download
} from 'lucide-react';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';

const VERCEL_API_URL = "/api/generate";

// ✅ CRITICAL: Must be 'export default'
export default function Generator() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLegendUser, setIsLegendUser] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    progress,
    currentMessage,
    startSummoning,
    completeSummoning,
    failSummoning
  } = useSummoningSequence();

  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          setIsLegendUser(data?.isUnlimited === true || data?.tier === 'legend');
        }
      }
      setAuthLoading(false);
    });
  }, []);

  const handleLogin = async () => {
    const auth = getFirebaseAuth();
    setError(null);
    try {
      if (Capacitor.isNativePlatform()) {
        const loginResult = await (SocialLogin as any).login({
          provider: 'google',
          options: {
            clientId: '994498276710-kriv0t2p1o82v59s7el0q65705u6kmgd.apps.googleusercontent.com',
            scopes: ['profile', 'email']
          }
        });
        
        // ✅ THE FIX: @ts-ignore
        // @ts-ignore
        const token = loginResult.result?.idToken || loginResult.result?.token || (loginResult.result as any)?.token;

        if (token) {
          const credential = GoogleAuthProvider.credential(token);
          await signInWithCredential(auth, credential);
        }
      } else {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("LOGIN FAILED. PLEASE TRY AGAIN.");
    }
  };

  const handleSummon = async () => {
    if (!prompt || !user) return;
    setError(null);
    setIsGenerating(true);

    try {
      const db = getFirebaseDb();
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          credits: 2,
          email: user.email,
          isUnlimited: false,
          createdAt: new Date().toISOString()
        });
      }

      const userData = userSnap.data();
      const isLegend = userData?.isUnlimited === true || userData?.tier === 'legend';
      setIsLegendUser(isLegend);

      if (!isLegend && (userData?.credits || 0) <= 0) {
        throw new Error("OUT OF CREDITS");
      }

      startSummoning();

      const response = await fetch(VERCEL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          userId: user.uid,
          userName: user.displayName || "Anonymous Creator"
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "GENERATION FAILED");

      setResultImage(data.imageUrl);
      setEnhancedPrompt(data.enhancedPrompt);
      completeSummoning();

      if (!isLegend) {
        await updateDoc(userRef, { credits: increment(-1) });
      }
    } catch (err: any) {
      setError(err.message || "THE SPIRITS ARE SILENT...");
      failSummoning(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading) return <div className="flex justify-center py-20"><RefreshCw className="animate-spin" size={32} /></div>;

  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto p-12 text-center bg-zinc-900/40 border-2 border-dashed border-white/5 rounded-[2.5rem]">
        <h2 className="text-2xl font-black uppercase italic text-white mb-6">Summoning Locked</h2>
        <button onClick={handleLogin} className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[11px]">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-white">
      <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl shadow-2xl">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="DESCRIBE YOUR VISION..."
          disabled={isGenerating}
          className="w-full bg-transparent border-none outline-none text-xl font-black italic tracking-tighter uppercase placeholder:text-zinc-800 resize-none h-32"
        />
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handleSummon}
            disabled={isGenerating || !prompt}
            className="px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] bg-white text-black hover:bg-cyan-400 transition-all flex items-center gap-3"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {isGenerating ? 'SUMMONING...' : 'SUMMON'}
          </button>
        </div>
      </div>
      {/* Result mapping goes here */}
    </div>
  );
}