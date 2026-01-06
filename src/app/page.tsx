"use client";
import React, { useState } from 'react';
import { GeneratorInput } from "@/components/GeneratorInput";
import { LoadingBar } from "@/components/LoadingBar";
import { useSummoningSequence } from "@/hooks/useSummoningSequence";

export default function ViralookStudio() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // 1. Initialize the custom summoning hook
  const { currentMessage, progress } = useSummoningSequence(isLoading);

  const handleSummon = async (config: any) => {
    setIsLoading(true);
    try {
      // Your existing logic to call the Vercel Proxy (src/app/api/fal/proxy/route.ts)
      // const response = await callFalProxy(config);
      // setGeneratedImage(response.image_url);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-black text-center mb-12 tracking-tighter">
        VIRALOOK <span className="text-cyan-500">AI STUDIO</span>
      </h1>

      <div className="max-w-2xl mx-auto">
        {/* 2. Conditional Rendering: Swap Input for the Summoning Sequence */}
        {isLoading ? (
          <LoadingBar message={currentMessage} progress={progress} />
        ) : (
          <GeneratorInput onSummon={handleSummon} isLoading={isLoading} />
        )}

        {/* 3. Display Result */}
        {generatedImage && !isLoading && (
          <div className="mt-12 animate-in fade-in zoom-in duration-700">
            <img src={generatedImage} alt="Summoned Art" className="rounded-3xl shadow-2xl border border-white/10" />
          </div>
        )}
      </div>
    </div>
  );
}
