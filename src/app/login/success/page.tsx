"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Professional celebration on entry
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#ffffff', '#000000']
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-zinc-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-2xl shadow-2xl text-center space-y-8">
        
        {/* Animated Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
          <div className="relative bg-zinc-900 border border-white/10 w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner">
            <CheckCircle2 size={40} className="text-blue-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Account Verified</h1>
          <p className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase leading-relaxed px-4">
            Welcome to the future of <br/> visual storytelling.
          </p>
        </div>

        <div className="pt-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full h-[50px] bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-all text-[11px] tracking-widest flex items-center justify-center gap-3 shadow-xl"
          >
            ENTER AI STUDIO
            <Sparkles size={14} />
          </button>
        </div>
      </div>

      <p className="mt-10 text-[7px] font-bold text-zinc-800 uppercase tracking-[0.5em]">
        VIRALOOK SYSTEM ID: {Math.random().toString(36).substring(7).toUpperCase()}
      </p>
    </div>
  );
}
