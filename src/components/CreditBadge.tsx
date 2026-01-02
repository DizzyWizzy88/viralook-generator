"use client";

import { useState, useEffect } from "react";

export default function CreditBadge() {
  const [credits, setCredits] = useState<number | string | null>(null);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch("/api/generate", { method: "POST", body: JSON.stringify({ checkOnly: true }) });
        const data = await res.json();
        setCredits(data.remaining === Infinity ? "∞" : data.remaining);
      } catch (e) {
        setCredits(0);
      }
    }
    fetchCredits();
  }, []);

  if (credits === null) return null;

  return (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 shadow-sm">
      <span className="text-sm font-bold text-purple-700 uppercase tracking-wider">
        Credits: {credits}
      </span>
      {credits !== "∞" && (
        <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      )}
    </div>
  );
}
