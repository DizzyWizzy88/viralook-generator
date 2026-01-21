"use client";

import React, { useState } from 'react';
import LoadingBar from './LoadingBar'; 
import GeneratorInput from './GeneratorInput'; // FIXED: No curly braces
import { useSummoningSequence } from '@/hooks/useSummoningSequence';
import ImageGallery from './ImageGallery';

export default function Generator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { progress, startSummoning, resetSummoning } = useSummoningSequence();

  const handleGenerate = async (prompt: string) => {
    if (!prompt) return;
    setIsGenerating(true);
    startSummoning();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.imageUrl) setGeneratedImages((prev) => [data.imageUrl, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
      resetSummoning();
    }
  };

  return (
    <div className="w-full space-y-12">
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <LoadingBar progress={progress} />
        </div>
      ) : (
        <GeneratorInput onGenerate={handleGenerate} />
      )}

      {generatedImages.length > 0 && (
        <div className="pt-12 border-t border-zinc-900">
          <ImageGallery images={generatedImages} />
        </div>
      )}
    </div>
  );
}
