"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function PricingTable({ userId }: { userId?: string }) {
  const handleCheckout = async (planType: string) => {
    if (!userId) return alert("Please log in first.");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, planType }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed", err);
    }
  };

  const plans = [
    { 
      name: "Starter", 
      price: "0", 
      type: "free", 
      credits: "Standard Quality", 
      features: ["Standard Resolution", "Public Vault"], 
      btn: "5 Free Generations", // Updated Label
      theme: "white",
      isLegend: false 
    },
    { 
      name: "Pro Studio", 
      price: "19.99", 
      type: "pro", 
      credits: "50 Generations/mo", 
      features: ["HD Quality", "Private Vault", "Priority Support"], 
      btn: "Pro Monthly", // Updated Label
      theme: "blue", 
      popular: true,
      isLegend: false 
    },
    { 
      name: "Viral Legend", 
      price: "39.99", 
      type: "unlimited", 
      credits: "Unlimited Generations", 
      features: ["4K Resolution", "Commercial License", "All Styles"], 
      btn: "Viral Legend for 39.99", // Updated Label
      theme: "dark", 
      isLegend: true // Triggers the Border Beam
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch px-4">
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={`relative rounded-[3rem] flex flex-col items-center text-center transition-all duration-500 shadow-2xl ${
            plan.isLegend 
              ? "border-beam-card scale-105 z-20" // The moving light border
              : plan.theme === 'blue' 
                ? "bg-black border-2 border-blue-600 scale-105 z-10 p-10" 
                : "bg-white text-black z-0 p-10"
          }`}
        >
          {/* Inner container for the Legend card to allow the beam to show on the edge */}
          <div className={`${plan.isLegend ? "card-inner-bg p-10 w-full h-full flex flex-col items-center" : "contents"}`}>
            
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-widest whitespace-nowrap shadow-xl">
                Most Popular
              </span>
            )}
            
            <div className="space-y-2">
              <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${plan.theme === 'white' ? 'text-black' : 'text-white'}`}>
                {plan.name}
              </h3>
              <div className="flex justify-center items-baseline gap-1">
                <span className={`text-6xl font-black italic tracking-tighter ${plan.theme === 'white' ? 'text-black' : 'text-white'}`}>
                  ${plan.price}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.theme === 'white' ? 'opacity-40' : 'opacity-60 text-white'}`}>
                  /mo
                </span>
              </div>
            </div>

            <span className={`mt-8 text-[11px] font-black uppercase tracking-widest py-2 px-4 rounded-full ${
              plan.theme === 'blue' ? 'bg-blue-500/10 text-blue-500' : 
              plan.isLegend ? 'bg-purple-500/10 text-purple-400' : 'bg-zinc-100 text-zinc-500'
            }`}>
              {plan.credits}
            </span>

            <ul className={`flex-1 mt-8 space-y-4 text-[10px] font-bold uppercase tracking-widest opacity-80 text-left w-full max-w-[200px] mx-auto ${plan.theme === 'white' ? 'text-black' : 'text-white'}`}>
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle2 size={14} className={plan.theme === 'blue' ? 'text-blue-500' : plan.isLegend ? 'text-purple-500' : 'text-zinc-400'}/> 
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => plan.type !== 'free' && handleCheckout(plan.type)}
              className={`w-full mt-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 ${
                plan.isLegend ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20" :
                plan.theme === 'blue' ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg" : 
                "bg-zinc-100 text-black hover:bg-zinc-200"
              }`}
            >
              {plan.btn}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
