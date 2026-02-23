"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Crown, Sparkles, ArrowRight, Zap } from "lucide-react"; // Added Zap for Pro

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  // Detect if it's 'legend' or 'pro' from the URL
  const plan = searchParams.get("plan") || "pro"; 
  const isLegend = plan === 'legend';

  useEffect(() => {
    if (!sessionId) return;

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      const primaryColor = isLegend ? '#06b6d4' : '#3b82f6';
      
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, 
        colors: [primaryColor, '#ffffff'] 
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, 
        colors: [primaryColor, '#ffffff'] 
      });
    }, 250);

    return () => clearInterval(interval);
  }, [sessionId, isLegend]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center overflow-hidden">
      {/* Background Glow - Dynamic color */}
      <div className={`fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,${isLegend ? '#0e1a1f' : '#0e131f'},#000_100%)] -z-10`} />

      <div className="relative animate-in zoom-in duration-1000">
        {/* Icon change: Crown for Legend, Zap for Pro */}
        <div className={`w-24 h-24 ${isLegend ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]' : 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)]'} rounded-full flex items-center justify-center mx-auto mb-8 border transition-all`}>
          {isLegend ? (
            <Crown size={48} className="text-cyan-400" />
          ) : (
            <Zap size={48} className="text-blue-400" />
          )}
        </div>

        {/* Text change */}
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4 uppercase">
          {isLegend ? (
            <>LEGENDARY <span className="text-cyan-500">STATUS</span></>
          ) : (
            <>PRO <span className="text-blue-500">ACTIVATED</span></>
          )}
        </h1>
        
        <p className="text-zinc-400 font-bold tracking-[0.3em] uppercase text-xs mb-12">
          {isLegend 
            ? "The AI Gods have accepted your offering" 
            : "500 Monthly Credits have been added to your balance"}
        </p>

        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className={`group flex items-center gap-3 bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all hover:scale-105 active:scale-95 ${isLegend ? 'hover:bg-cyan-400' : 'hover:bg-blue-500 hover:text-white'}`}
          >
            Enter the Studio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
            {isLegend ? "Unlimited Summoning Enabled" : "High-Speed AI Generation Enabled"}
          </p>
        </div>
      </div>
      
      {/* Dynamic Floating Sparkles */}
      <div className="absolute top-1/4 left-1/4 animate-pulse opacity-20"><Sparkles className="text-white" /></div>
      <div className="absolute bottom-1/4 right-1/4 animate-pulse delay-700 opacity-20">
        <Sparkles className={isLegend ? "text-cyan-500" : "text-blue-500"} />
      </div>
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
