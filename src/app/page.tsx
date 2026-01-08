"use client";

import React from 'react';
import Generator from "@/components/Generator";
import PricingTable from "@/components/PricingTable";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header / Brand Bar */}
        <header className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter">VIRALOOK</h1>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">AI Studio</span>
          </div>
          <div className="bg-zinc-800/50 px-4 py-2 rounded-2xl border border-zinc-700 flex items-center gap-2">
            <span className="text-[10px] font-black text-zinc-500 tracking-tighter">•••</span>
            <span className="text-[10px] font-black text-cyan-400 uppercase">Credits</span>
          </div>
        </header>

        {/* Pricing Cards Row */}
        <section>
          <PricingTable />
        </section>

        {/* Prompt Input Section */}
        <section className="max-w-3xl mx-auto space-y-8 pb-20">
          <Generator />
          
          <div className="flex justify-center">
             <button className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
               Explore Creations
             </button>
          </div>
        </section>
        
      </div>
    </main>
  );
}
