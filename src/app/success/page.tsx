"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-5 text-white">
      {/* SUCCESS LOGO */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
        <img src="/Viralook.png" alt="Viralook" className="h-14 w-14 object-contain" />
      </div>

      <h1 className="mb-2 text-center text-3xl font-black tracking-[0.2em] uppercase">
        Welcome to the Elite
      </h1>
      <p className="mb-10 max-w-[300px] text-center text-sm leading-relaxed text-gray-400">
        Your credits have been synchronized with your Viralook AI Studio account.
      </p>

      <div className="mb-10 w-full max-w-[400px] rounded-[25px] border border-white/10 bg-[#050505] p-6 shadow-xl">
        <h2 className="mb-4 text-[10px] font-black tracking-widest text-cyan-400 uppercase">
          What's Next?
        </h2>
        <ul className="space-y-3 text-sm font-medium opacity-80">
          <li>• Head back to your dashboard</li>
          <li>• Describe your fashion vision</li>
          <li>• Generate high-res fashion assets</li>
        </ul>
      </div>

      <button 
        onClick={() => router.push('/dashboard')}
        className="rounded-xl bg-white px-10 py-4 text-sm font-black tracking-widest text-black transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        LAUNCH STUDIO
      </button>
      
      <footer className="absolute bottom-8 text-[10px] font-bold tracking-widest text-gray-700 uppercase">
        viralook.ai | Payment Secured by Stripe
      </footer>
    </div>
  );
}
