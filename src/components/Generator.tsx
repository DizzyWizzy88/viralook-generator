"use client";

import { useState, useEffect } from "react";
import { fal } from "@fal-ai/client";

// Strategic brand messages from the Business Plan
const SUMMONING_MESSAGES = [
  "Summoning the AI Gods...",
  "Synthesizing new realities...",
  "Polishing the pixels...",
  "Checking for creative compliance...",
];

// Configure the client to use our secure proxy established in /api/fal/proxy
fal.config({
  proxyUrl: "/api/fal/proxy",
});

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UX Differentiation: The "AI Summoning Sequence"
  // Rotates messages every 3 seconds while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % SUMMONING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsLoading(true);
    setImageUrl(null);
    setError(null);
    setMessageIndex(0);

    try {
      // 1. Call our local API to check/deduct credits via Device ID
      const creditCheck = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      if (creditCheck.status === 402) {
        throw new Error("Out of credits! Upgrade to Viral Legend for unlimited access.");
      }

      if (!creditCheck.ok) {
        throw new Error("Failed to verify credits.");
      }

      // 2. Trigger the actual AI generation using fal.ai Flux Dev model
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: prompt,
          image_size: "landscape_4_3",
          num_inference_steps: 28,
          guidance_scale: 3.5,
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log("Queue update:", update.status);
        },
      });

      if (result.data?.images?.[0]?.url) {
        setImageUrl(result.data.images[0].url);
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 text-center bg-white rounded-3xl shadow-xl border border-purple-50">
      <div className="space-y-4 text-left">
        <label className="block text-sm font-bold text-purple-900 ml-2">
          Describe your viral look
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A high-fashion streetwear suit made of holographic liquid glass, walking through a neon Tokyo garden..."
          className="w-full p-4 rounded-2xl border-2 border-purple-100 focus:border-purple-600 outline-none h-32 text-gray-700 bg-purple-50/30 transition-all resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Summoning...
            </>
          ) : (
            "Generate Viral Look"
          )}
        </button>
      </div>

      {/* Dynamic Summoning Display */}
      {isLoading && (
        <div className="flex flex-col items-center py-10 space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
          </div>
          <p className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse">
            {SUMMONING_MESSAGES[messageIndex]}
          </p>
        </div>
      )}

      {/* Error Message with Call to Action */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-medium">
          <p>{error}</p>
          {error.includes("credits") && (
            <button className="mt-2 text-sm underline font-bold text-red-700 hover:text-red-800">
              Upgrade to Viral Legend →
            </button>
          )}
        </div>
      )}

      {/* Generated Output */}
      {imageUrl && !isLoading && (
        <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white animate-in slide-in-from-bottom-10 duration-700">
          <img 
            src={imageUrl} 
            alt="Generated viral fashion look" 
            className="w-full h-auto" 
          />
        </div>
      )}
    </div>
  );
}
