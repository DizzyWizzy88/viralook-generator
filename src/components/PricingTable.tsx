'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, getFirebaseAuth } from '@/lib/firebase';

export default function PricingTable() {
  const router = useRouter();
  const [userTier, setUserTier] = useState<string | null>(null);
  const [isLegend, setIsLegend] = useState(false);
  const [loading, setLoading] = useState<string | null>(null); // Track which plan is loading

  // Listen for Auth changes and check tier
useEffect(() => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      console.log("User detected:", currentUser.uid); // Debugging
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserTier(data?.tier || 'starter'); // Default to starter
        setIsLegend(data?.isUnlimited === true);
      }
    } else {
      console.log("No user detected");
    }
  });
}, []);

  const plans = [
    {
      name: "Starter",
      id: "starter",
      priceId: null,
      price: "$0",
      interval: "",
      features: ["2 One-time Credits", "Llama Basic Expansion", "Public Feed Only"],
      buttonText: "Get Started Free",
      highlight: false,
    },
    {
      name: "Pro Monthly",
      id: "pro",
      priceId: "price_1SlG310ZcMLctEm4DPIgTkyR", 
      price: "$19.99",
      interval: "/mo",
      features: ["500 Credits/mo", "Llama Expert Prompts", "Public Feed"],
      buttonText: "Subscribe Pro",
      highlight: false,
    },
    {
      name: "Viral Legend",
      id: "legend",
      priceId: "price_1SlG4r0ZcMLctEm4Nyh0rswZ", 
      price: "$39.99",
      interval: "/mo",
      features: ["Unlimited Credits", "Llama Creative Director", "Private Mode (Hidden)"],
      buttonText: "Subscribe Legend",
      highlight: true,
    }
  ];

  const handleCheckout = async (priceId: string | null, planId: string) => {
  if (!priceId) {
    // If it's the free starter plan
    alert("You are now using the Starter plan! 2 credits have been added to your account.");
    router.push('/dashboard'); 
    return;
  }  

    setLoading(planId); // Set loading for this specific plan

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ priceId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        setLoading(null); // Stop loading if error
        if (res.status === 401) {
          alert("Please sign in to upgrade your plan.");
          router.push('/login');
        } else {
          const errorData = await res.json().catch(() => ({}));
          alert(errorData.error || "Checkout failed. Please try again.");
        }
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(null);
        alert("Could not initialize Stripe. Try again later.");
      }
    } catch (err) {
      setLoading(null); // Stop loading on network crash
      console.error("Checkout error:", err);
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-12">
      {plans.map((plan) => {
        const isCurrentPlan = (plan.id === 'legend' && isLegend) || (plan.id === userTier);
        const isCurrentlyLoading = loading === plan.id;

        return (
          <div 
            key={plan.name} 
            className={`flex flex-col p-8 rounded-3xl border-2 transition-all ${
              plan.highlight ? 'bg-white border-blue-600 shadow-2xl scale-105' : 'bg-white border-gray-200'
            }`}
          >
            <h3 className="text-2xl font-black text-zinc-950">{plan.name}</h3>
            
            <div className="my-6">
              <span className="text-5xl font-black text-zinc-950">{plan.price}</span>
              <span className="text-zinc-500 text-lg font-bold">{plan.interval}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map(feat => (
                <li key={feat} className="flex items-center gap-2 text-sm font-extrabold text-zinc-800">
                  <span className="text-blue-600">✅</span> {feat}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => !isCurrentPlan && !isCurrentlyLoading && handleCheckout(plan.priceId, plan.id)} 
              disabled={isCurrentPlan || !!loading}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex justify-center items-center ${
                isCurrentPlan 
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border-2 border-zinc-200' 
                  : plan.highlight 
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' 
                    : 'bg-black text-white hover:bg-zinc-800'
              } ${loading && !isCurrentlyLoading ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isCurrentPlan ? "CURRENT PLAN" : isCurrentlyLoading ? "LOADING..." : plan.buttonText}
            </button>
          </div>
        );
      })}
    </div>
  );
}
