"use client";

import React, { useState } from 'react';

export default function GeneratorInput({ onGenerate }: { onGenerate: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="space-y-6">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your vision..."
        className="w-full h-48 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-8 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
      />
      
      <button
        onClick={() => onGenerate(prompt)}
        className="w-full py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all active:scale-[0.98]"
      >
        Create Visual
      </button>
    </div>
  );
}
