"use client";

import React, { useState } from 'react';
import { useSummoningSequence } from '@/hooks/useSummoningSequence';
import { db, getFirebaseAuth } from '@/lib/firebase';
import { 
  doc, 
  updateDoc, 
  increment, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { Sparkles, Zap, AlertCircle, RefreshCw, Wand2 } from 'lucide-react';

const VERCEL_API_URL = "/api/generate";

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Using the updated hook with phase control
  const { 
    progress, 
    currentMessage, 
    startSummoning, 
    completeSummoning, 
    failSummoning 
  } = useSummoningSequence();

  const handleSummon = async () => {
    if (!prompt) return;
    
    setError(null);
    setResultImage(null);
    setEnhancedPrompt(null);
    setIsGenerating(true);

    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("PLEASE LOGIN TO SUMMON");
      setIsGenerating(false);
      return;
    }

    try {
      // 1. Credit Check & User Init
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
      if (!userData?.isUnlimited && (userData?.credits || 0) <= 0) {
        throw new Error("OUT OF CREDITS");
      }

      // 2. Start Visual Sequence
      startSummoning();

      // 3. API Call (Triggers Llama + Flux)
      const response = await fetch(VERCEL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          userId: user.uid 
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "GENERATION FAILED");
      }

      // 4. Success State
      setResultImage(data.imageUrl);
      setEnhancedPrompt(data.enhancedPrompt);
      completeSummoning();

      // 5. Deduct Credit
      if (!userData?.isUnlimited) {
        await updateDoc(userRef, { credits: increment(-1) });
      }
      
    } catch (err: any) {
      console.error("Summoning error:", err);
      const errorMessage = err.message || "THE SPIRITS ARE SILENT...";
      setError(errorMessage);
      failSummoning(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Input Section */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl shadow-2xl">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="DESCRIBE YOUR VISION..."
          disabled={isGenerating}
          className="w-full bg-transparent border-none outline-none text-xl font-black italic tracking-tighter uppercase placeholder:text-zinc-800 resize-none h-32 text-white"
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-zinc-600">
            <Zap size={14} className={isGenerating ? "animate-pulse text-yellow-400" : ""} />
            <span className="text-[9px] font-black tracking-widest uppercase">1 Credit Per Summon</span>
          </div>

          <button
            onClick={handleSummon}
            disabled={isGenerating || !prompt}
            className={`px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center gap-3 ${
              isGenerating 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-cyan-400 hover:scale-105 active:scale-95 shadow-lg'
            }`}
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {isGenerating ? 'SUMMONING...' : 'SUMMON'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="space-y-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 bg-[length:200%_auto] animate-shimmer transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <p className="text-center text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">
            {currentMessage}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && !isGenerating && (
        <div className="flex items-center justify-center gap-3 text-red-500 font-black text-[10px] tracking-widest uppercase py-4 border border-red-500/20 rounded-2xl bg-red-500/5">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Final Result Display */}
      {resultImage && !isGenerating && (
        <div className="space-y-6 animate-in zoom-in-95 duration-700">
          <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group">
             <img src={resultImage} alt="Summoned Vision" className="w-full h-auto object-cover" />
             
             {/* Hover Overlay with Enhanced Prompt */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <Wand2 size={14} />
                  <span className="text-[10px] font-black tracking-widest uppercase">AI Architect Expansion</span>
                </div>
                <p className="text-xs text-zinc-200 italic leading-relaxed line-clamp-4">
                  "{enhancedPrompt}"
                </p>
             </div>
          </div>

          {/* Quick Info Badge */}
          <div className="bg-zinc-900/30 rounded-2xl p-5 border border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Technique</p>
              <p className="text-[11px] text-zinc-400 font-medium">Flux.1 Schnell + Llama 3.1 8B</p>
            </div>
            <button 
              onClick={() => window.open(resultImage, '_blank')}
              className="text-[9px] font-black tracking-widest uppercase text-white hover:text-cyan-400 transition-colors"
            >
              HD DOWNLOAD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
