"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Shield, Globe, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Viralook.png" alt="Viralook Logo" className="h-8 w-auto" />
            <span className="font-black italic text-xl tracking-tighter text-blue-500 uppercase">Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              Launch App
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500 mb-4 animate-fade-in">
            <Sparkles size={12} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Viralook v2.0 Engine Now Live</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] animate-slide-up">
            AI Visuals. <br/>
            <span className="text-zinc-800">No Limits.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">
            The world's most powerful AI generation studio for creators. 
            Claim your 5 free generations and start designing the future today.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <Link href="/login" className="w-full md:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] group">
              Get Started For Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-4 px-6 text-zinc-600">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800" />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Joined by 2,000+ Creators</span>
            </div>
          </div>
        </header>

        {/* Feature Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Hyper-Speed</h3>
            <p className="text-zinc-500 text-sm leading-relaxed uppercase font-bold tracking-tight">Render high-fidelity 4K assets in under 10 seconds with our proprietary cluster.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <Globe size={20} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Global Feed</h3>
            <p className="text-zinc-500 text-sm leading-relaxed uppercase font-bold tracking-tight">Get inspired by what the world is creating in real-time. Remix and evolve ideas.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Full Rights</h3>
            <p className="text-zinc-500 text-sm leading-relaxed uppercase font-bold tracking-tight">You own everything you create. Commercial usage rights included in Pro and Unlimited.</p>
          </div>
        </section>

        {/* Pricing Section Link */}
        <section id="pricing" className="bg-zinc-900/20 py-32 border-y border-white/5">
           <div className="max-w-3xl mx-auto text-center space-y-12">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Simple, Bold Pricing.</h2>
              <p className="text-zinc-400 font-medium">From free experimentation to unlimited production power.</p>
              <Link href="/login" className="inline-block px-12 py-5 border border-white/10 hover:border-blue-500/50 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase transition-all">
                View All Plans
              </Link>
           </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em]">
            © 2024 VIRALOOK GENERATOR. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </div>
  );
}

