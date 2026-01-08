"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

// Using DEFAULT export to match your page.tsx import
export default function PricingTable({ userId }: { userId?: string }) {
  const handleCheckout = async (planType: string) => {
    if (!userId) return alert("Please log in first.");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planType }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* 1. Starter Plan */}
      <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] flex flex-col">
        <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Starter</h3>
        <div className="text-3xl font-black mb-6">$0 <span className="text-sm font-normal text-zinc-600">/mo</span></div>
        <ul className="space-y-4 mb-8 flex-grow">
          <li className="flex items-center gap-2 text-sm text-zinc-400"><CheckCircle2 size={16} /> 5 Free Generations</li>
        </ul>
        <button className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold text-sm transition-all">
          Current Plan
        </button>
      </div>

      {/* 2. Pro Plan */}
      <div className="p-8 bg-zinc-900/50 border border-blue-500/30 rounded-[2.5rem] flex flex-col relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Popular</div>
        <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">Pro</h3>
        <div className="text-3xl font-black mb-6">$19.99 <span className="text-sm font-normal text-zinc-600">/mo</span></div>
        <ul className="space-y-4 mb-8 flex-grow text-sm text-zinc-300">
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> 100 Generations /mo</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Commercial License</li>
        </ul>
        <button 
          onClick={() => handleCheckout('pro')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          Upgrade to Pro
        </button>
      </div>

      {/* 3. Viral Legend (The specialized effect card) */}
      <div className="p-8 bg-black border border-zinc-800 rounded-[2.5rem] flex flex-col relative group overflow-hidden">
        {/* The Animated Border Beam effect */}
        <div className="absolute inset-0 border-beam-card rounded-[2.5rem] pointer-events-none" />
        
        <h3 className="text-zinc-100 font-bold text-xs uppercase tracking-widest mb-2">Viral Legend</h3>
        <div className="text-3xl font-black mb-6">$39.99 <span className="text-sm font-normal text-zinc-600">/mo</span></div>
        <ul className="space-y-4 mb-8 flex-grow text-sm text-zinc-300">
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-500" /> Unlimited Generations</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-500" /> Priority Server Access</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-500" /> Viral Mastermind Discord</li>
        </ul>
        <button 
          onClick={() => handleCheckout('legend')}
          className="w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-sm transition-all shadow-xl"
        >
          Become a Legend
        </button>
      </div>
    </div>
  );
}
