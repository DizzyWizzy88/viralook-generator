"use client";

import { useState, useEffect } from "react";
import { fal } from "@fal-ai/client";

// Strategic brand messages
const SUMMONING_MESSAGES = [
  "Summoning the AI Gods...",
  "Synthesizing new realities...",
  "Polishing the pixels...",
  "Checking for creative compliance...",
];

// Configure the secure proxy
fal.config({
  proxyUrl: "/api/fal/proxy",
});

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOutOfCredits, setIsOutOfCredits] = useState(false);

  // AI Summoning Sequence Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % SUMMONING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleUpgrade = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ 
          // Replace with your actual Stripe Price ID from your dashboard
          priceId: "price_1SXuQu0pfq0FZDdaueO1vTwC" 
        }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Stripe redirect failed", err);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsLoading(true);
    setImageUrl(null);
    setError(null);
    setIsOutOfCredits(false);

    try {
      // 1. Call the "Bouncer" API to check/deduct credits
      const creditCheck = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      if (creditCheck.status === 402) {
        setIsOutOfCredits(true);
        throw new Error("Out of credits!");
      }

      if (!creditCheck.ok) throw new Error("Security check failed.");

      // 2. Real AI Generation
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: { prompt: prompt },
      });

      if (result.data?.images?.[0]?.url) {
        setImageUrl(result.data.images[0].url);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 text-center bg-white rounded-3xl shadow-xl border border-purple-50">
      <div className="space-y-4 text-left">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your viral look..."
          className="w-full p-4 rounded-2xl border-2 border-purple-100 focus:border-purple-600 outline-none h-32 bg-purple-50/30 transition-all"
        />
        
        {!isOutOfCredits ? (
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Summoning..." : "Generate Viral Look"}
          </button>
        ) : (
          <button
            onClick={handleUpgrade}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold rounded-2xl shadow-lg animate-bounce"
          >
            Upgrade to Viral Legend (Unlimited)
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center py-10 space-y-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-purple-600 animate-pulse">
            {SUMMONING_MESSAGES[messageIndex]}
          </p>
        </div>
      )}

      {error && !isOutOfCredits && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>
      )}

      {imageUrl && (
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          <img src={imageUrl} alt="AI Generated Fashion" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
}
