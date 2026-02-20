'use client';
import { useRouter } from 'next/navigation';

export default function PricingTable() {
  const router = useRouter();

  const plans = [
    {
      name: "Starter",
      priceId: null,
      price: "$0",
      interval: "",
      features: ["2 One-time Credits", "Llama Basic Expansion", "Public Feed Only"],
      buttonText: "Get Started Free",
      highlight: false,
    },
    {
      name: "Pro Monthly",
      priceId: "price_1SlG4r0ZcMLctEm4Nyh0rswZ", 
      price: "$19.99",
      interval: "/mo",
      features: ["500 Credits/mo", "Llama Expert Prompts", "Public Feed"],
      buttonText: "Subscribe Pro",
      highlight: false,
    },
    {
      name: "Viral Legend",
      priceId: "price_LEGEND_39_RECURRING_ID", 
      price: "$39.99",
      interval: "/mo",
      features: ["Unlimited Credits", "Llama Creative Director", "Private Mode (Hidden)"],
      buttonText: "Subscribe Legend",
      highlight: true,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-12">
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={`flex flex-col p-8 rounded-3xl border-2 transition-all bg-white ${
            plan.highlight ? 'border-blue-600 shadow-2xl scale-105' : 'border-gray-200'
          }`}
        >
          {/* Force text-zinc-950 for absolute visibility */}
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
            onClick={() => {/* handleCheckout logic */}} 
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              plan.highlight ? 'bg-blue-600 text-white shadow-lg' : 'bg-black text-white'
            }`}
          >
            {plan.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}
'use client';
import { useRouter } from 'next/navigation';

export default function PricingTable() {
  const router = useRouter();

  const plans = [
    {
      name: "Starter",
      priceId: null,
      price: "$0",
      interval: "",
      features: ["2 One-time Credits", "Llama Basic Expansion", "Public Feed Only"],
      buttonText: "Get Started Free",
      highlight: false,
    },
    {
      name: "Pro Monthly",
      priceId: "price_1SlG4r0ZcMLctEm4Nyh0rswZ", 
      price: "$19.99",
     interval: "/mo",
      features: ["500 Credits/mo", "Llama Expert Prompts", "Public Feed"],
      buttonText: "Subscribe Pro",
      highlight: false,
    },
    {
      name: "Viral Legend",
      priceId: "price_1SlG4r0ZcMLctEm4Nyh0rswZ", 
      price: "$39.99",
      interval: "/mo",
      features: ["Unlimited Credits", "Llama Creative Director", "Private Mode (Hidden)"],
      buttonText: "Subscribe Legend",
      highlight: true,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-12">
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={`flex flex-col p-8 rounded-3xl border-2 transition-all bg-white ${
            plan.highlight ? 'border-blue-600 shadow-2xl scale-105' : 'border-gray-200'
          }`}
        >
          {/* Force text-zinc-950 for absolute visibility */}
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
            onClick={() => {/* handleCheckout logic */}} 
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              plan.highlight ? 'bg-blue-600 text-white shadow-lg' : 'bg-black text-white'
            }`}
          >
            {plan.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}
