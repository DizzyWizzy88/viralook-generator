"use client";

import React, { useState, useEffect } from 'react';

export default function LoadingBar({ isLoading }: { isLoading: boolean }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Consulting the AI Gods...",
    "Injecting Viral energy...",
    "Polishing the pixels...",
    "Fine-tuning the identity...",
    "Almost ready for the spotlight...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let messageInterval: NodeJS.Timeout;

    if (isLoading) {
      setProgress(0);
      setMessageIndex(0);

      // Simulate progress bar filling up over 6 seconds
      interval = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 1.5 : prev));
      }, 100);

      // Cycle through messages every 1.5 seconds
      messageInterval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 1500);
    } else {
      setProgress(100);
    }

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/80 backdrop-blur-md">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-6">
          <div className="inline-block animate-bounce mb-4">
            <span className="text-4xl">🎨</span>
          </div>
          <h3 className="text-white text-sm font-black uppercase tracking-[0.2em] animate-pulse">
            {messages[messageIndex]}
          </h3>
        </div>

        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="mt-4 text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
          Estimated time: 6.0s
        </p>
      </div>
    </div>
  );
}
