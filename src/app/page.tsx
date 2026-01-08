"use client";

import React from 'react';
import Generator from "@/components/Generator";
import PricingTable from "@/components/PricingTable";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Branding Header */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">V</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tighter leading-none uppercase">Viralook</span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-[0.2em] uppercase">AI Studio</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 space-y-24">
        {/* Pricing Cards (Top) */}
        <section>
          <PricingTable />
        </section>

        {/* Generator Area (Bottom) */}
        <section className="max-w-3xl mx-auto">
          <Generator />
        </section>
      </div>
    </main>
  );
}
