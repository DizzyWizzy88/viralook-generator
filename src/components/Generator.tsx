"use client";

import React, { useState } from 'react';
import { useSummoningSequence } from '@/hooks/useSummoningSequence';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { Sparkles, Zap, AlertCircle, Download, RefreshCw } from 'lucide-react';

// Using your Vercel domain for the API call
const VERCEL_API_URL = "https://viralook-generator.vercel.app/api/generate";

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { progress, currentMessage, startSummoning } = useSummoningSequence();

  const handleSummon = async () => {
    if (!prompt) return;
    
    setError(null);
    setIsGenerating(true);
    setResultImage(null);

    const db = getFirebaseDb();
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("PLEASE LOGIN TO SUMMON");
      setIsGenerating(false);
      return;
    }

    try {
      // 1. Credit Check Logic with Number Safety
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // Force conversion to number to prevent "String vs Number" errors
      const currentCredits = Number(userData?.credits || 0);

      if (!userData?.isUnlimited && currentCredits <= 0) {
        setError("OUT OF CREDITS");
        setIsGenerating(false);
        return;
      }

      // 2. Start the visual loading sequence
      startSummoning();

      // 3. Call your Vercel API Proxy
      const response = await fetch(VERCEL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Generation failed");
      }

      // 4. Success - Deduct credit and show image
      if (!userData?.isUnlimited) {
        // Use increment(-1) to safely decrease the count in Firestore
        await updateDoc(userRef, { credits: increment(-1) });
      }

      setResultImage(data.imageUrl);
      
    } catch (err: any) {
      console.error("Summoning error:", err);
      setError(err.message || "THE SPIRITS ARE SILENT... TRY AGAIN.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `viralook-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("COULD NOT SAVE IMAGE");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl shadow-inner">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="DESCRIBE THE VIBE..."
          disabled={isGenerating}
          className="w-full bg-transparent border-none outline-none text-xl md:text-2xl font-black italic tracking-tighter uppercase placeholder:text-zinc-800 resize-none h-40 text-white scrollbar-hide"
        />
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-zinc-600 px-2">
            <Zap size={14} className={isGenerating ? "animate-pulse text-blue-500" : ""} />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">1 Credit Per Summon</span>
          </div>

          <button
            onClick={handleSummon}
            disabled={isGenerating || !prompt}
            className={`px-8 py-4 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] transition-all flex items-center gap-3 ${
              isGenerating 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/10'
            }`}
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {isGenerating ? 'SUMMONING...' : 'SUMMON'}
          </button>
        </div>
      </div>

      {/* Generation Status / Progress */}
      {isGenerating && (
        <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-500">
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 transition-all duration-700 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <p className="text-center text-[10px] font-black tracking-[0.6em] uppercase text-blue-500 italic animate-pulse">
            {currentMessage}
          </p>
        </div>
      )}

      {/* Error Message Display */}
      {error && (
        <div className="flex items-center justify-center gap-3 text-red-500 font-black text-[11px] tracking-widest uppercase py-5 border border-red-500/20 rounded-3xl bg-red-500/5 animate-shake">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Final Result Display */}
      {resultImage && !isGenerating && (
        <div className="group relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <img 
            src={resultImage} 
            alt="Viralook AI Result" 
            className="w-full h-auto transition-transform duration-1000 group-hover:scale-110" 
          />
          
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6 backdrop-blur-sm">
            <button 
              onClick={handleDownload}
              className="p-5 bg-white text-black rounded-full hover:scale-110 hover:bg-blue-400 transition-all shadow-2xl"
              title="Save to device"
            >
              <Download size={28} />
            </button>
            <button 
              onClick={() => setResultImage(null)}
              className="p-5 bg-zinc-800 text-white rounded-full hover:scale-110 hover:bg-red-500 transition-all shadow-2xl"
            >
              <RefreshCw size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
