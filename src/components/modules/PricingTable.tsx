import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from "firebase/firestore";
import { db, getFirebaseAuth } from "@/lib/firebase";

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$0',
    description: 'Perfect for trying us out',
    features: ["2 One-time Credits", "Llama Basic Expansion", "Public Feed Only"],
    priceId: null,
  },
  {
    id: 'pro',
    name: 'Pro Monthly',
    price: '$19.99',
    description: 'For power users',
    features: ["500 Credits/mo", "Llama Expert Prompts", "Public Feed"],
    priceId: 'price_1SlG310ZcMLctEm4DPIgTkyR', // Replace with your actual Stripe ID
  },
  {
    id: 'legend',
    name: 'Viral Legend',
    price: '$39.99',
    description: 'Unlimited creative power',
    features: ["Unlimited Credits", "Llama Creative Director", "Private Mode (Hidden)"],
    priceId: 'price_1SlG4r0ZcMLctEm4Nyh0rswZ', // Replace with your actual Stripe ID
  }
];

export default function PricingTable() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string | null, planId: string) => {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please sign in first!");
      return;
    }

    setLoading(planId);

    try {
      if (!priceId || planId === 'starter') {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          credits: 2,
          tier: 'starter',
          updatedAt: new Date().toISOString()
        }, { merge: true });

        alert("Starter plan activated! 2 credits added.");
        router.push('/dashboard');
      } else {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId, userId: user.uid, userEmail: user.email, planId: planId }),
        });

        const session = await response.json();

        if (session.url) {
          window.location.href = session.url;
        } else {
          alert("Could not create Stripe session.");
        }
      } 
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong with the checkout process.");
    } finally {
      setLoading(null);
    }
  }; // This closes the function correctly

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="border border-zinc-800 bg-zinc-900/50 p-8 rounded-2xl flex flex-col">
            <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
            <div className="mt-4 flex items-baseline text-white">
              <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
            </div>
            <p className="mt-2 text-zinc-400">{plan.description}</p>
            
            <ul className="mt-6 space-y-4 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex text-zinc-300 text-sm">
                  <span className="text-green-500 mr-2">✓</span> {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan.priceId, plan.id)}
              disabled={loading !== null}
              className={`mt-8 w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                plan.id === 'pro' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-black'
              }`}
            >
              {loading === plan.id ? "Processing..." : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

