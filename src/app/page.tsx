"use client";

import React from 'react';
import Generator from "@/components/Generator";
import PricingTable from "@/components/PricingTable";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white py-12">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-16">
        
        {/* Header Bar */}
        <div className="w-full max-w-5xl bg-[#0f0f0f] border border-zinc-800 p-6 rounded-[2.5rem] flex justify-between items-center px-10">
          <div>
            <h1 className="text-xl font-black tracking-tighter">VIRALOOK</h1>
            <p className="text-[8px] text-cyan-500 font-bold uppercase tracking-[0.3em]">AI Studio</p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800">
             <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Credits</span>
          </div>
        </div>

        {/* The Grid Section */}
        <div className="w-full">
          <PricingTable />
        </div>

        {/* The Generation Section */}
        <div className="w-full max-w-3xl px-4">
          <Generator />
        </div>

        <button className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] hover:text-white transition-all pt-10">
          Explore Creations
        </button>

      </div>
    </main>
  );
}
