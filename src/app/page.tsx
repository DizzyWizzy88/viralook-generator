"use client";

import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/Viralook.png" alt="Viralook Logo" className="h-8 w-auto" />
            <span className="font-black italic tracking-tighter text-xl text-blue-500">STUDIO</span>
          </div>
          
          <div className="flex items-center gap-8">
            {/* Added Login Link Here */}
            <a href="/login" className="text-[10px] font-bold tracking-[0.2em] hover:text-blue-500 transition uppercase">
              Log In
            </a>
            <div className="bg-zinc-900/50 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">5 Credits</span>
              <button className="ml-2 text-[10px] font-black text-blue-500 hover:text-white transition">GET MORE</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter italic leading-none">
            VISUALIZE <span className="text-zinc-700">EVERYTHING.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-500 font-medium text-lg leading-relaxed uppercase tracking-wide">
            The high-fidelity AI engine for everyone. Generate cinematic art, portraits, and concepts in 2k resolution.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3">
          {['Cinematic', 'Portrait', 'Anime', 'Fantasy', 'Minimalist'].map((cat) => (
            <button key={cat} className="px-6 py-3 rounded-full bg-zinc-900 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">
              {cat}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="max-w-3xl mx-auto relative group">
          <input 
            type="text"
            placeholder="What do you want to see?"
            className="w-full bg-zinc-900/80 border border-white/10 rounded-[2.5rem] px-10 py-8 text-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-zinc-700"
          />
          <button className="absolute right-4 top-4 bottom-4 px-10 bg-blue-700 hover:bg-blue-600 rounded-[1.8rem] font-black text-sm tracking-widest transition-all shadow-2xl shadow-blue-500/20">
            GENERATE
          </button>
        </div>
      </main>
    </div>
  );
}
