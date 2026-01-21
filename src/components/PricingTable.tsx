"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function PricingTable({ userId }: { userId?: string }) {
  const handleCheckout = async (planType: string) => {
    if (!userId) return alert("Please log in first.");
    // ... your checkout logic
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
      {/* Starter Card */}
      <div className="bg-[#0f0f0f] border border-zinc-800 p-8 rounded-[2rem] flex flex-col items-start text-left">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Starter</span>
        <div className="text-3xl font-black mb-6 text-white">$0</div>
        <button className="w-full py-3 bg-zinc-800 text-zinc-500 rounded-xl font-bold text-xs uppercase tracking-widest cursor-default">
          Current
        </button>
      </div>

      {/* Pro Card (Highlighted) */}
      <div className="bg-[#0f0f0f] border-2 border-cyan-500 p-8 rounded-[2rem] flex flex-col items-start text-left relative shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-[8px] font-black px-3 py-1 rounded-full uppercase text-black">Popular</div>
        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Pro</span>
        <div className="text-3xl font-black mb-6 text-white">$19.99</div>
        <button className="w-full py-3 bg-cyan-500 text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all">
          Upgrade
        </button>
      </div>

      {/* Legend Card */}
      <div className="bg-[#0f0f0f] border border-zinc-800 p-8 rounded-[2rem] flex flex-col items-start text-left">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Legend</span>
        <div className="text-3xl font-black mb-6 text-white">$39.99</div>
        <button className="w-full py-3 bg-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-700 transition-all">
          Go Legend
        </button>
      </div>
    </div>
  );
}
