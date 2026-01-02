"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SUMMONING_MESSAGES = [
  "Summoning the AI Gods...",
  "Consulting the fashion oracle...",
  "Polishing the pixels...",
  "Generating viral potential...",
  "Optimizing for the algorithm...",
];

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  // The "Summoning Sequence" Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % SUMMONING_MESSAGES.length);
      }, 2800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      if (response.status === 402) {
        // Redirect to pricing if credits are empty
        router.push("/#pricing"); 
        return;
      }

      const data = await response.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 text-center bg-white rounded-3xl shadow-xl border border-purple-50">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Create Your Look</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the outfit, lighting, and vibe..."
          className="w-full p-4 rounded-2xl border-2 border-purple-100 focus:border-purple-500 outline-none transition-all h-32 text-gray-700 bg-purple-50/30"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-purple-200"
        >
          {isLoading ? "Summoning..." : "Generate Viral Look"}
        </button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center py-10 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-indigo-400 rounded-full animate-reverse-spin"></div>
          </div>
          <p className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse">
            {SUMMONING_MESSAGES[messageIndex]}
          </p>
        </div>
      )}

      {imageUrl && (
        <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white group relative">
          <img src={imageUrl} alt="Generated look" className="w-full h-auto transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
