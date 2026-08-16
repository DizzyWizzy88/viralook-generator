"use client";

import { useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirebaseAuth } from "../../lib/firebase";
import { useSummoningSequence } from "../../hooks/useSummoningSequence";
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

export default function Generator() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const { currentMessage, startSummoning, completeSummoning, failSummoning } = useSummoningSequence();

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    setLoginMessage(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed:", err);
      setLoginMessage("AUTHENTICATION FAILED. PLEASE TRY AGAIN.");
    }
  };

  const handleSummon = async () => {
    if (!prompt.trim() || !user) return;

    setError(null);
    setResultImage(null);
    setEnhancedPrompt(null);
    setIsGenerating(true);
    startSummoning();

    try {
      const idToken = await user.getIdToken();

      const API_URL = "https://viralook-generator-2-uvh4.onrender.com/api/generate";

      const finalEnhancedPrompt = prompt;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ prompt: finalEnhancedPrompt }),
      });

      // Safely capture raw text first to avoid crashing on empty or HTML responses
      const rawText = await response.text();

      let data: { 
        imageUrl?: string; 
        enhancedPrompt?: string; 
        finalEnhancedPrompt?: string;
        error?: string 
      } = {};

      if (rawText) {
        try {
          data = JSON.parse(rawText) as typeof data;
        } catch {
          throw new Error(`Server returned non-JSON response (${response.status})`);
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `GENERATION FAILED (${response.status})`);
      }

      setResultImage(data.imageUrl ?? null);
      setEnhancedPrompt(data.enhancedPrompt ?? data.finalEnhancedPrompt ?? null);
      completeSummoning();
    } catch (err) {
      console.error("Summoning error:", err);
      const errorObject = err as Error;
      const msg = errorObject.message || "THE SPIRITS ARE SILENT...";
      setError(msg);
      failSummoning(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-zinc-950 border border-zinc-800 rounded-3xl text-center space-y-6">
        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto border border-zinc-800">
          <Lock className="w-6 h-6 text-zinc-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-widest text-white"> Authentication Required </h2>
          <p className="text-xs text-zinc-400"> Sign in to access studio generation features and manage high-impact assets. </p>
        </div>
        {loginMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
            {loginMessage}
          </div>
        )}
        <button
          onClick={handleLogin}
          className="w-full py-3 px-4 bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          Sign In With Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold text-zinc-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Viralook Studio v2.0
        </div>
        <h1 className="text-3xl font-black uppercase tracking-widest text-white"> Summon High-Impact Assets </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
          Enter your core creative vision to synthesize hyper-realistic content
        </p>
      </div>

      {/* INPUT FORM CONTAINER */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            Creative Vision Prompt
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. Cyberpunk street runner in neon rain, commercial studio lighting, 8k resolution..."
            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-zinc-500 p-4 rounded-2xl text-xs text-white placeholder:text-zinc-600 outline-none transition-all tracking-wider font-medium resize-none disabled:opacity-50"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSummon}
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{currentMessage || "Synthesizing Asset..."}</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-black" />
              <span>Initialize Summoning</span>
            </>
          )}
        </button>
      </div>

      {/* RESULT IMAGE DISPLAY */}
      {resultImage && !isGenerating && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl relative group min-h-[300px] bg-zinc-950 flex items-center justify-center">
            <img
              src={resultImage}
              alt="Summoned Vision"
              className="w-full h-auto object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-6">
              <a
                href={resultImage}
                target="_blank"
                rel="noopener noreferrer"
                download="summoned-vision.png"
                className="px-4 py-2 bg-white text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg"
              >
                <Download className="w-4 h-4" />
                Download Asset
              </a>
            </div>
          </div>

          {enhancedPrompt && (
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500"> Enhanced Prompt Geometry </h3>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed">{enhancedPrompt}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}