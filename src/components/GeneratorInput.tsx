"use client";

import { useState } from 'react';

// Universal styles for all users
const STYLES = [
  { id: 'cinematic', label: '🎬 Cinematic', prompt: 'cinematic film still, 35mm lens, moody lighting, highly detailed, 8k' },
  { id: 'portrait', label: '👤 Portrait', prompt: 'professional studio portrait, bokeh background, sharp focus, hyper-realistic' },
  { id: 'anime', label: '⛩️ Anime', prompt: 'high-end anime art style, vibrant colors, Makoto Shinkai aesthetic, detailed' },
  { id: 'fantasy', label: '🐉 Fantasy', prompt: 'epic fantasy illustration, mystical atmosphere, intricate detail, magical lighting' },
  { id: 'minimal', label: '⚪ Minimalist', prompt: 'clean minimalist aesthetic, soft lighting, neutral tones, high-end' }
];

const RATIOS = [
  { id: 'square_hd', label: '1:1', desc: 'Post' },
  { id: 'portrait_4_5', label: '4:5', desc: 'Social' },
  { id: 'landscape_16_9', label: '16:9', desc: 'Wide' }
];

export default function GeneratorInput({ onGenerate, isLoading }: any) {
  const [prompt, setPrompt] = useState('');
  const [activeStyle, setActiveStyle] = useState(STYLES[0].id);
  const [activeRatio, setActiveRatio] = useState(RATIOS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const selectedStyle = STYLES.find(s => s.id === activeStyle)?.prompt || '';
    
    // Construct the full prompt for the AI
    const fullPrompt = `${prompt}, style: ${selectedStyle}`;
    
    onGenerate(fullPrompt, activeRatio);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* 1. Style Selection */}
      <div className="flex flex-wrap justify-center gap-3">
        {STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => setActiveStyle(style.id)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeStyle === style.id 
              ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' 
              : 'bg-white/5 text-zinc-500 hover:bg-white/10 border border-white/5'
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
          {/* 2. Text Input */}
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What do you want to see?"
            className="flex-1 bg-transparent border-none px-8 py-6 text-white placeholder-zinc-500 focus:ring-0 text-lg"
          />

          <div className="flex items-center gap-2 p-2">
            {/* 3. Aspect Ratio Toggle */}
            <div className="flex bg-black/40 rounded-2xl p-1 border border-white/5">
              {RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setActiveRatio(ratio.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                    activeRatio === ratio.id 
                    ? 'bg-zinc-800 text-white shadow-inner' 
                    : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>

            {/* 4. Generate Button */}
            <button 
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : 'Generate'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Help Text */}
      <p className="text-center text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-medium">
        Press enter to visualize your concept
      </p>
    </div>
  );
}
