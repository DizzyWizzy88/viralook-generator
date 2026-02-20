"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Crown, Sparkles, ArrowRight } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // 1. Fire the Viral Legend Confetti
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        // Using your branding colors: Cyan and Blue
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#06b6d4', '#ffffff'] });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#3b82f6', '#ffffff'] });
      }, 250);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#0e1a1f_0%,#000_100%)] -z-10" />

      <div className="relative animate-in zoom-in duration-1000">
        <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
          <Crown size={48} className="text-cyan-400" />
        </div>

        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4">
          LEGENDARY <span className="text-cyan-500">STATUS</span>
        </h1>
        
        <p className="text-zinc-400 font-bold tracking-[0.3em] uppercase text-xs mb-12">
          The AI Gods have accepted your offering
        </p>

        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="group flex items-center gap-3 bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95"
          >
            Enter the Studio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
            Unlimited Summoning Enabled
          </p>
        </div>
      </div>
      
      {/* Floating Sparkles Decoration */}
      <div className="absolute top-1/4 left-1/4 animate-pulse opacity-20"><Sparkles className="text-white" /></div>
      <div className="absolute bottom-1/4 right-1/4 animate-pulse delay-700 opacity-20"><Sparkles className="text-cyan-500" /></div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SuccessContent />
    </Suspense>
  );
}

