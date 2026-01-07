"use client";

import React, { useState } from 'react';
import LoadingBar from './LoadingBar'; // Fixed Default Import
import GeneratorInput from './GeneratorInput';
import { useSummoningSequence } from '@/hooks/useSummoningSequence';
import ImageGallery from './ImageGallery';

export default function Generator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  
  /**
   * We pull the current progress and control functions 
   * from your custom hook to drive the LoadingBar.
   */
  const { progress, startSummoning, resetSummoning } = useSummoningSequence();

  const handleGenerate = async (prompt: string) => {
    if (!prompt) return;

    // 1. Enter the "Summoning" state
    setIsGenerating(true);
    startSummoning(); 

    try {
      // 2. Call your internal API route
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("The AI Gods are busy. Please try again later.");
      }

      const data = await response.json();
      
      // 3. Update the gallery with the new image URL
      if (data.imageUrl) {
        setGeneratedImages((prev) => [data.imageUrl, ...prev]);
      }
      
    } catch (error) {
      console.error("Summoning error:", error);
      alert("Something went wrong during the summoning ritual.");
    } finally {
      // 4. Exit the "Summoning" state and reset the bar
      setIsGenerating(false);
      resetSummoning();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-10 px-4">
      {/* CONDITIONAL RENDERING:
          If isGenerating is true, the user sees the high-end loader.
          Otherwise, they see the input field.
      */}
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in-95 duration-1000">
          <LoadingBar progress={progress} />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <GeneratorInput onGenerate={handleGenerate} />
        </div>
      )}

      {/* GALLERY SECTION:
          Appears only once images have been created.
      */}
      {generatedImages.length > 0 && (
        <div className="pt-16 border-t border-zinc-900 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">
              Manifested Creations
            </h2>
            <div className="h-[1px] flex-1 bg-zinc-900" />
          </div>
          
          <ImageGallery images={generatedImages} />
        </div>
      )}
    </div>
  );
}
