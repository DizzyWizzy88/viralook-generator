"use client";

import React from 'react';

/**
 * LoadingBar Component
 * Displays the "Summoning" state with a shimmering text effect 
 * and a modern, high-tech progress line.
 */
export default function LoadingBar({ progress }: { progress: number }) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-12 space-y-8">
      
      {/* 1. The Summoning Text */}
      {/* The 'summoning-shimmer' class must be defined in your globals.css */}
      <div className="summoning-shimmer text-center text-sm md:text-base tracking-[0.3em] uppercase font-black italic">
        Summoning the AI Gods...
      </div>

      {/* 2. The Progress Track */}
      <div className="relative w-full h-[1px] bg-zinc-800 rounded-full overflow-hidden">
        
        {/* The Actual Progress Fill */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />
        
        {/* Kinetic Scan Effect (The moving light pulse) */}
        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan" />
      </div>

      {/* 3. Status Percentage */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-black text-zinc-500 tracking-[0.4em] uppercase opacity-70">
          Manifesting {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
