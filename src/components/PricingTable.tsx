import { useRouter } from 'next/navigation';

export default function PricingTable() {
  const router = useRouter();

  const plans = [
    {
      name: "Starter",
      priceId: null, // No Stripe ID
      credits: 2,
      price: "$0",
      interval: "",
      description: "Perfect for testing the waters.",
      buttonText: "Get Started Free",
      highlight: false,
    },
    {
      name: "Pro Monthly",
      priceId: "price_1SlG310ZcMLctEm4DPIgTkyR", // Replace with your $19.99 Recurring ID
      credits: "Unlimited", 
      price: "$19.99",
      interval: "/mo",
      description: "Standard recurring power for creators.",
      buttonText: "Subscribe Pro",
      highlight: false,
    },
    {
      name: "Viral Legend",
      priceId: "price_1SlG4r0ZcMLctEm4Nyh0rswZ", // Replace with your $39.99 Recurring ID
      credits: "Unlimited+", // Or a higher priority tier
      price: "$39.99",
      interval: "/mo",
      description: "Ultimate recurring tier for professionals.",
      buttonText: "Subscribe Legend",
      highlight: true,
    }
 price_1SlG4r0ZcMLctEm4Nyh0rswZ ];

  const handleCheckout = async (priceId: string | null) => {
    if (!priceId) {
      router.push('/dashboard');
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ priceId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-12">
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={`flex flex-col p-8 rounded-3xl border-2 transition-all ${
            plan.highlight ? 'border-blue-600 shadow-2xl scale-105 bg-white' : 'border-gray-200 bg-gray-50'
          }`}
        >
          {plan.highlight && (
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">
              BEST VALUE
            </span>
          )}
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <div className="my-6">
            <span className="text-5xl font-black">{plan.price}</span>
            <span className="text-gray-500 text-lg">{plan.interval}</span>
          </div>
          <p className="text-gray-600 mb-8">{plan.description}</p>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center gap-2">✅ <strong>{plan.credits}</strong> Generations</li>
            <li className="flex items-center gap-2">✅ Llama 3.1 Expansion</li>
          </ul>
          <button 
            onClick={() => handleCheckout(plan.priceId)}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              plan.highlight ? 'bg-blue-600 text-white' : 'bg-black text-white'
            }`}
          >
            {plan.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}
