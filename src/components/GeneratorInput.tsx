"use client";

import React, { useState } from 'react';

export default function GeneratorInput({ onGenerate }: { onGenerate: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="space-y-6">
      <div className="relative group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your vision..."
          className="w-full h-48 bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-8 text-white placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-all resize-none"
        />
      </div>
      
      <button
        onClick={() => onGenerate(prompt)}
        className="w-full py-6 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
      >
        Create Visual
      </button>
    </div>
  );
}
