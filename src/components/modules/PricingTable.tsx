

const PLAN_PRICE_IDS = {
  pro: 'price_1U3P4e0ZcMLctEm4hwPWTDWM',
  viral_legend: 'price_1U3P3q0ZcMLctEm4I4M7XWeB',
} as const;

export type PlanKey = keyof typeof PLAN_PRICE_IDS;

interface PricingTableProps {
  onSelectPlan?: (planKey: PlanKey, priceId: string) => void;
  loadingPlan?: string | null;
}

export default function PricingTable({ onSelectPlan, loadingPlan }: PricingTableProps) {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white">
          Choose Your Plan
        </h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-2">
          Unlock more generation credits and features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* PRO PLAN */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white">Pro</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                  For active creators
                </p>
              </div>
            </div>

            <div className="my-6">
              <span className="text-4xl font-black text-white">$4.99</span>
              <span className="text-zinc-500 text-xs uppercase tracking-wider ml-2">/ month</span>
            </div>

            <ul className="space-y-3 mb-8 text-xs text-zinc-300 font-medium">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> 50 Credits per month
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Fast generation processing
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Standard export resolution
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onSelectPlan && onSelectPlan('pro', PLAN_PRICE_IDS.pro)}
            disabled={loadingPlan === 'pro'}
            className="w-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[11px] transition-all cursor-pointer disabled:opacity-50"
          >
            {loadingPlan === 'pro' ? 'PROCESSING...' : 'GET PRO'}
          </button>
        </div>

        {/* VIRAL LEGEND PLAN */}
        <div className="bg-zinc-950 border-2 border-white/20 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-white/5">
          <div className="absolute top-4 right-4 bg-white text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
            Most Popular
          </div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  Viral Legend
                </h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Unlimited access
                </p>
              </div>
            </div>

            <div className="my-6">
              <span className="text-4xl font-black text-white">$12.99</span>
              <span className="text-zinc-500 text-xs uppercase tracking-wider ml-2">/ month</span>
            </div>

            <ul className="space-y-3 mb-8 text-xs text-zinc-300 font-medium">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Unlimited Generations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Priority processing speed
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Full HD high-res exports
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Early access to new features
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onSelectPlan && onSelectPlan('viral_legend', PLAN_PRICE_IDS.viral_legend)}
            disabled={loadingPlan === 'viral_legend'}
            className="w-full bg-white text-black hover:bg-zinc-200 font-black py-4 rounded-xl uppercase tracking-widest text-[11px] transition-all cursor-pointer disabled:opacity-50"
          >
            {loadingPlan === 'viral_legend' ? 'PROCESSING...' : 'GO LEGEND'}
          </button>
        </div>
      </div>
    </div>
  );
}