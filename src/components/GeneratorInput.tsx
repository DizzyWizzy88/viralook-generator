"use client";

import React, { useState } from 'react';
import LoadingBar from './LoadingBar'; 
import { GeneratorInput } from './GeneratorInput';
import { useSummoningSequence } from '@/hooks/useSummoningSequence';
import ImageGallery from './ImageGallery';

export default function Generator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  
  // Hook to track the progress of the AI summoning ritual
  const { progress, startSummoning, resetSummoning } = useSummoningSequence();

  const handleGenerate = async (prompt: string) => {
    if (!prompt) return;

    // Trigger the loading state and progress bar
    setIsGenerating(true);
    startSummoning();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Manifestation failed");

      const data = await response.json();
      
      // Update gallery with the new creation
      if (data.imageUrl) {
        setGeneratedImages((prev) => [data.imageUrl, ...prev]);
      }
    } catch (error) {
      console.error("Error during summoning:", error);
      alert("The connection to the AI gods was interrupted. Please try again.");
    } finally {
      // Return to the original dashboard input state
      setIsGenerating(false);
      resetSummoning();
    }
  };

  return (
    <div className="w-full space-y-12">
      {/* SWITCHING LOGIC:
          When 'isGenerating' is true, show the high-end shimmer loader.
          When false, show your original 'Describe your vision' input.
      */}
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-700">
          <LoadingBar progress={progress} />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <GeneratorInput onGenerate={handleGenerate} />
        </div>
      )}

      {/* Results Gallery */}
      {generatedImages.length > 0 && (
        <div className="pt-12 border-t border-zinc-900">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8 italic">
            Recent Manifestations
          </h2>
          <ImageGallery images={generatedImages} />
        </div>
      )}
    </div>
  );
}
