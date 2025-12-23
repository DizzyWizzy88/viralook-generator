"use client";

import React from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase/clientApp';
import { Zap, Check, Sparkles } from 'lucide-react';

const tiers = [
  {
    name: "Free",
    price: "0",
    interval: "",
    credits: 5,
    description: "Perfect for beginners.",
    features: ["5 Free Generations", "Standard Speed", "Global Feed Access"],
    buttonText: "Current Plan",
    priceId: null,
  },
  {
    name: "Pro",
    price: "19.99",
    interval: "/mo",
    credits: 200,
    description: "For serious creators.",
    features: ["200 Monthly Credits", "Fast Generation", "Private Vault", "Priority Support"],
    buttonText: "Upgrade to Pro",
    priceId: "price_PRO_MONTHLY_ID", // Replace with Stripe Subscription Price ID
    popular: true,
  },
  {
    name: "Unlimited",
    price: "39.99",
    interval: "/mo",
    credits: 999999,
    description: "The ultimate studio tool.",
    features: ["Infinite Generations", "Ultra-Fast GPU Access", "Commercial Rights", "Early Access"],
    buttonText: "Go Unlimited",
    priceId: "price_UNLIMITED_MONTHLY_ID", // Replace with Stripe Subscription Price ID
  },
];

export default function PricingTable() {
  const auth = getAuth(app);

  const handlePurchase = async (priceId: string | null, credits: number, tierName: string) => {
    if (!priceId) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to upgrade.");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.uid,
          credits: credits,
          tier: tierName,
          mode: "subscription" // Tells the API to create a subscription, not a one-time charge
        }),
      });

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      {tiers.map((tier) => (
        <div 
          key={tier.name} 
          className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 ${
            tier.popular 
            ? 'border-blue-500 bg-blue-500/5 shadow-2xl shadow-blue-500/10' 
            : 'border-white/5 bg-zinc-900/40'
          }`}
        >
          <div className="text-center space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">{tier.name}</p>
            <div className="flex items-baseline justify-center">
              <span className="text-xl font-bold italic">$</span>
              <span className="text-5xl font-black italic tracking-tighter">{tier.price}</span>
              <span className="text-zinc-500 font-bold ml-1">{tier.interval}</span>
            </div>
            
            <div className="space-y-4 py-4">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-left">
                  <Check size={12} className="text-blue-500" />
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePurchase(tier.priceId, tier.credits, tier.name)}
              disabled={tier.price === "0"}
              className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all ${
                tier.price === "0" 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-blue-600 hover:text-white shadow-xl'
              }`}
            >
              {tier.buttonText}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
