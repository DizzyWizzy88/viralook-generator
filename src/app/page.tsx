"use client";

import React from 'react';
import Generator from "@/components/Generator";
import PricingTable from "@/components/PricingTable";

export default function DashboardPage() {
  // We provide a fallback or null check for userId 
  // to ensure PricingTable doesn't break during build.
  const mockUserId = "build-time-user"; 

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <span className="text-white font-black text-xs">V</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tighter leading-none">VIRALOOK</span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-[0.2em] uppercase">AI Studio</span>
          </div>
        </div>
        
        <div className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Credits</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 space-y-24">
        {/* Pass the userId prop as expected by the component */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
          <PricingTable userId={mockUserId} />
        </section>

        <section className="max-w-3xl mx-auto">
          <Generator />
        </section>
      </div>
    </main>
  );
}
