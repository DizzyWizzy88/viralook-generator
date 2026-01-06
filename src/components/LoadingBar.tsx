import React from 'react';

interface LoadingBarProps {
  message: string;
  progress: number;
}

export const LoadingBar = ({ message, progress }: LoadingBarProps) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-8 py-12 animate-in fade-in duration-1000">
      
      {/* 1. Dynamic Summoning Message */}
      <div className="text-center space-y-2">
        <p className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
          {message}
        </p>
        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">
          Establishing Secure fal.ai Neural Link...
        </p>
      </div>

      {/* 2. Neon Progress Track */}
      <div className="relative">
        {/* Glow Effect behind the bar */}
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-50" />
        
        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600 bg-[length:200%_100%] animate-shimmer transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 3. Diagnostic Data Grid */}
      <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
        <div className="text-center space-y-1">
          <span className="block text-gray-700 text-[9px] uppercase font-black">Stability</span>
          <span className="text-emerald-500 font-mono text-xs">NOMINAL</span>
        </div>
        <div className="text-center space-y-1 border-x border-white/5">
          <span className="block text-gray-700 text-[9px] uppercase font-black">Synthesis</span>
          <span className="text-white font-mono text-xs">{Math.round(progress)}%</span>
        </div>
        <div className="text-center space-y-1">
          <span className="block text-gray-700 text-[9px] uppercase font-black">Latency</span>
          <span className="text-cyan-500 font-mono text-xs">LOW</span>
        </div>
      </div>

      {/* 4. Lore Footer */}
      <div className="text-center">
        <span className="text-[8px] text-gray-800 uppercase tracking-[0.5em] font-bold">
          Viralook AI Studio — Verified Synthesis Protocol v2026
        </span>
      </div>
    </div>
  );
};
