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
    { name: "Starter", price: "0", type: "free", credits: "5 Free Generations", features: ["Standard Resolution", "Public Vault"], btn: "Current Plan", theme: "white" },
    { name: "Pro Studio", price: "19.99", type: "pro", credits: "50 Generations/mo", features: ["HD Quality", "Private Vault", "Priority Support"], btn: "Upgrade to Pro", theme: "blue", popular: true },
    { name: "Viral Legend", price: "39.99", type: "unlimited", credits: "Unlimited Generations", features: ["4K Resolution", "Commercial License", "All Styles"], btn: "Go Unlimited", theme: "white" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch px-4">
      {plans.map((plan) => (
        <div key={plan.name} className={`relative rounded-[3rem] p-10 flex flex-col items-center text-center space-y-8 transition-all duration-500 shadow-2xl ${
          plan.theme === 'blue' ? "bg-black border-2 border-blue-600 scale-105 z-10" : "bg-white text-black z-0"
        }`}>
          {plan.popular && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-widest whitespace-nowrap shadow-xl">
              Most Popular
            </span>
          )}
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{plan.name}</h3>
            <div className="flex justify-center items-baseline gap-1">
              <span className="text-6xl font-black italic tracking-tighter">${plan.price}</span>
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">/mo</span>
            </div>
          </div>

          <span className={`text-[11px] font-black uppercase tracking-widest py-2 px-4 rounded-full ${
            plan.theme === 'blue' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-100 text-zinc-500'
          }`}>
            {plan.credits}
          </span>

          <ul className="flex-1 space-y-4 text-[10px] font-bold uppercase tracking-widest opacity-80 text-left w-full max-w-[200px] mx-auto">
            {plan.features.map(f => (
              <li key={f} className="flex items-center gap-3">
                <CheckCircle2 size={14} className={plan.theme === 'blue' ? 'text-blue-500' : 'text-zinc-400'}/> 
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button 
            onClick={() => plan.type !== 'free' && handleCheckout(plan.type)}
            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 ${
              plan.theme === 'blue' ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg" : "bg-zinc-100 text-black hover:bg-zinc-200"
            }`}
          >
            {plan.btn}
          </button>
        </div>
      ))}
    </div>
  );
}
