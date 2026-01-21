"use client";

import { useEffect, useState } from "react";

export default function CreditBadge() {
  const [data, setData] = useState<{ credits: number | string; tier: string } | null>(null);

  useEffect(() => {
    // Fetch user data from your existing generate route (which returns credit count)
    const checkCredits = async () => {
      try {
        const res = await fetch("/api/generate", { method: "POST", body: JSON.stringify({ ping: true }) });
        const json = await res.json();
        setData({
          credits: json.remaining === null ? "∞" : json.remaining,
          tier: json.tier || "free"
        });
      } catch (err) {
        console.error("Failed to load credits");
      }
    };
    checkCredits();
  }, []);

  if (!data) return null;

  const isLegend = data.tier === "viral_legend";
  const isPro = data.tier === "pro";

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full border shadow-sm transition-all ${
      isLegend ? "bg-orange-50 border-orange-200 text-orange-700" : 
      isPro ? "bg-purple-50 border-purple-200 text-purple-700" : 
      "bg-gray-50 border-gray-200 text-gray-600"
    }`}>
      <span className="text-xs font-bold uppercase tracking-wider mr-2">
        {isLegend ? "👑 Legend" : isPro ? "⭐ Pro" : "Free"}
      </span>
      <div className="h-4 w-[1px] bg-current opacity-20 mr-2"></div>
      <span className="font-mono font-bold">
        {data.credits} {typeof data.credits === "number" ? "Credits" : ""}
      </span>
    </div>
  );
}
