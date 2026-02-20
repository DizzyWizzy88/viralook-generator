"use client";

import React, { useState } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';
import { plans } from '@/lib/server/stripe'; // We'll use the names/prices from here
import { Zap, Crown, Check, Loader2 } from 'lucide-react';

export default function PricingTable() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePurchase = async (priceId: string, planName: string) => {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("PLEASE LOGIN TO UPGRADE");
      return;
    }

    setLoadingPlan(planName);

    try {
      // We call a new API route we need to create: /api/checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          email: user.email,
        }),
      });

      const { url, error } = await response.json();

      if (error) throw new Error(error);
      
      // Redirect to Stripe Checkout
      if (url) window.location.href = url;
      
    } catch (err) {
      console.error("Checkout error:", err);
      alert("THE PORTAL FAILED TO OPEN. TRY AGAIN.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto p-4">
      {/* PRO MONTHLY CARD */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between hover:border-blue-500/50 transition-all">
        <div>
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Zap size={18} />
            <span className="text-[10px] font-black tracking-widest uppercase">Entry Tier</span>
          </div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Pro Monthly</h3>
          <p className="text-4xl font-black mt-2 text-white">$19.99</p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-2 text-zinc-400 text-sm"><Check size={14} className="text-blue-500" /> 100 Summoning Credits</li>
            <li className="flex items-center gap-2 text-zinc-400 text-sm"><Check size={14} className="text-blue-500" /> High-Speed Flux Generation</li>
            <li className="flex items-center gap-2 text-zinc-400 text-sm"><Check size={14} className="text-blue-500" /> Basic Llama Enhancement</li>
          </ul>
        </div>
        <button
          onClick={() => handlePurchase('price_1SlG310ZcMLctEm4DPIgTkyR', 'PRO')}
          disabled={!!loadingPlan}
          className="w-full mt-8 bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-400 transition-all flex justify-center items-center"
        >
          {loadingPlan === 'PRO' ? <Loader2 className="animate-spin" /> : 'SELECT PRO'}
        </button>
      </div>

      {/* VIRAL LEGEND CARD */}
      <div className="relative bg-zinc-900/50 border-2 border-cyan-500/50 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        <div className="absolute top-0 right-0 bg-cyan-500 text-black px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl">
          Popular
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4 text-cyan-400">
            <Crown size={18} />
            <span className="text-[10px] font-black tracking-widest uppercase">Viral Tier</span>
          </div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Viral Legend</h3>
          <p className="text-4xl font-black mt-2 text-white">$49.99</p>
          <ul className="mt-6 space-y-3 text-white">
            <li className="flex items-center gap-2 text-sm"><Check size={14} className="text-cyan-400" /> UNLIMITED Summons</li>
            <li className="flex items-center gap-2 text-sm"><Check size={14} className="text-cyan-400" /> Max Priority Llama 3.1</li>
            <li className="flex items-center gap-2 text-sm"><Check size={14} className="text-cyan-400" /> Global Feed Spotlight</li>
          </ul>
        </div>
        <button
          onClick={() => handlePurchase('price_1SlG4r0ZcMLctEm4Nyh0rswZ', 'LEGEND')}
          disabled={!!loadingPlan}
          className="w-full mt-8 bg-cyan-500 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg flex justify-center items-center"
        >
          {loadingPlan === 'LEGEND' ? <Loader2 className="animate-spin" /> : 'SELECT LEGEND'}
        </button>
      </div>
    </div>
  );
}
