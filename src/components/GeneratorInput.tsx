import React, { useState } from 'react';
import { fal } from "@fal-ai/client";

interface GeneratorInputProps {
  onSummon: (config: any) => void;
  isLoading: boolean;
}

export const GeneratorInput = ({ onSummon, isLoading }: GeneratorInputProps) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('blurry, distorted, low quality, extra limbs');
  const [aspectRatio, setAspectRatio] = useState('square_hd');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  // Handle Image Upload for Style Reference
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // fal.ai client auto-uploads binary files and returns a temporary URL
      const url = await fal.storage.upload(file);
      setReferenceImage(url);
    }
  };

  const handleSummonClick = () => {
    if (!prompt) return;
    
    // Pass the professional-grade config back to the parent Generator
    onSummon({
      prompt,
      negative_prompt: negativePrompt,
      image_size: aspectRatio,
      ...(referenceImage && { image_url: referenceImage, strength: 0.8 }) // Style Reference
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
      
      {/* 1. Primary Prompt Input */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Summoning Command</label>
        <textarea 
          className="w-full bg-transparent border-b-2 border-white/10 py-3 text-lg text-white placeholder-gray-600 focus:border-cyan-500 transition-all outline-none resize-none"
          placeholder="Visualize the impossible..."
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      {/* 2. Aspect Ratio Selector (Tailwind Grid) */}
      <div className="space-y-3">
        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Canvas Geometry</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'square_hd', label: '1:1 Square', icon: 'aspect-square' },
            { id: 'portrait_16_9', label: '9:16 TikTok', icon: 'aspect-[9/16]' },
            { id: 'landscape_16_9', label: '16:9 Cinema', icon: 'aspect-video' }
          ].map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => setAspectRatio(ratio.id)}
              className={`py-3 rounded-xl border text-xs font-medium transition-all ${
                aspectRatio === ratio.id 
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                : 'border-white/5 text-gray-500 hover:border-white/20'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Style Reference Upload */}
      <div className="space-y-3">
        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Style Reference (Optional)</label>
        <div className="relative group">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="py-4 border-2 border-dashed border-white/5 rounded-2xl text-center group-hover:border-cyan-500/50 transition-all">
            <span className="text-gray-500 text-sm">
              {referenceImage ? "✅ Reference Locked" : "Click to upload style reference"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Advanced: Negative Prompting */}
      <details className="group">
        <summary className="text-xs uppercase tracking-widest text-gray-600 font-bold cursor-pointer list-none hover:text-gray-400 transition-colors">
          + Advanced Summoning Sigils
        </summary>
        <div className="pt-4">
          <input 
            className="w-full bg-white/5 rounded-lg p-3 text-sm text-gray-400 outline-none border border-transparent focus:border-white/10"
            placeholder="What should the AI ignore?"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
          />
        </div>
      </details>

      {/* 5. The Summon Button */}
      <button 
        disabled={isLoading || !prompt}
        onClick={handleSummonClick}
        className={`w-full py-4 rounded-2xl font-black text-lg tracking-tighter transition-all shadow-lg ${
          isLoading 
          ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
          : 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isLoading ? 'SUMMONING...' : 'BEGIN SYNTHESIS'}
      </button>
    </div>
  );
};
