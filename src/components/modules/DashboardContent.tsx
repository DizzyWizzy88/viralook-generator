import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreditBadge from './CreditBadge';
import PricingTable, { PlanKey } from './PricingTable';

interface UserProfile {
  credits?: number;
  isUnlimited?: boolean;
  email?: string;
}

interface FeedItem {
  id: string;
  imageUrl: string;
  prompt: string;
  author?: string;
  likes?: number;
}

interface DashboardContentProps {
  userProfile?: UserProfile | null;
  onGenerate?: (prompt: string, style?: string) => Promise<void>;
  onSelectPlan?: (planKey: PlanKey, priceId: string) => void;
  feedItems?: FeedItem[];
  isSummoning?: boolean;
  summoningStep?: string;
  loginMessage?: string | null;
}

export default function DashboardContent({
  userProfile,
  onGenerate,
  onSelectPlan,
  feedItems = [],
  isSummoning = false,
  summoningStep = 'INITIALIZING ARCHITECTURAL GRID...',
  loginMessage
}: DashboardContentProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cyberpunk');
  const [activeTab, setActiveTab] = useState<'create' | 'feed' | 'pricing'>('create');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isSummoning) return;

    if (onGenerate) {
      await onGenerate(prompt, selectedStyle);
    }
  };

  const handlePlanSelection = async (planKey: PlanKey, priceId: string) => {
    setLoadingPlan(String(planKey));
    try {
      if (onSelectPlan) {
        await onSelectPlan(planKey, priceId);
      } else {
        navigate('/pricing');
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* TOP HEADER SECTION */}
      <header className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-black">
        {/* BRAND LOGO + TEXT HEADER */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-auto flex items-center justify-start overflow-hidden">
            <img
              src="/Viralook.png"
              alt="Viralook Logo"
              className="h-full w-auto object-contain"
            />
          </div>
          <span className="text-white text-lg font-black uppercase tracking-widest border-l border-zinc-800 pl-3">
            Viralook AI Studio
          </span>
        </div>

        {/* RIGHT SIDE BADGES / NAV */}
        <div className="flex items-center gap-4">
          <CreditBadge
            credits={userProfile?.credits ?? 0}
            isUnlimited={userProfile?.isUnlimited ?? false}
            onUpgradeClick={() => setActiveTab('pricing')}
          />
        </div>
      </header>

      {/* LOGIN/NOTIFICATION BANNER */}
      {loginMessage && (
        <div className="bg-zinc-900 border-b border-zinc-800 p-3 text-center text-xs font-bold uppercase tracking-wider text-amber-400">
          {loginMessage}
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="border-b border-zinc-900 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto flex gap-8 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'create'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Studio Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'feed'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Community Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'pricing'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Plans & Billing
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto space-y-8 py-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black uppercase tracking-widest">
                Summon High-Impact Assets
              </h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Select your aesthetic preset and enter your core creative vision
              </p>
            </div>

            {/* SUMMONING SEQUENCE BOX */}
            {isSummoning ? (
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center space-y-4 animate-pulse">
                <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-black uppercase tracking-widest text-zinc-300">
                  {summoningStep}
                </p>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full animate-pulse w-2/3" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* STYLE PRESETS */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Aesthetic Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Cyberpunk', 'Minimalist', 'Hyper-Real', 'Dark Studio'].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setSelectedStyle(style)}
                        className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedStyle === style
                            ? 'bg-white text-black border-white'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PROMPT TEXTAREA */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Prompt Concept
                  </label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="ENTER YOUR DETAILED CREATIVE VISION..."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 p-4 rounded-xl text-xs text-white placeholder:text-zinc-600 outline-none transition-all tracking-wider font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all cursor-pointer disabled:opacity-50"
                >
                  INITIALIZE SUMMONING
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="space-y-6 py-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-widest">
                Community Creations
              </h2>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Real-time output stream
              </span>
            </div>

            {feedItems.length === 0 ? (
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-12 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
                No public assets generated yet. Be the first!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {feedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all"
                  >
                    <div className="aspect-square overflow-hidden bg-zinc-900 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-zinc-300 font-medium line-clamp-2">
                        {item.prompt}
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider pt-2 border-t border-zinc-900">
                        <span>{item.author || 'Anonymous'}</span>
                        {item.likes !== undefined && <span>❤️ {item.likes}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <PricingTable
            onSelectPlan={handlePlanSelection}
            loadingPlan={loadingPlan}
          />
        )}
      </main>

      {/* FOOTER NAV */}
      <footer className="p-6 border-t border-zinc-900 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
        <span>Viralook AI Studio &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}