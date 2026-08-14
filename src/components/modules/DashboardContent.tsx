import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import GlobalFeed from './GlobalFeed';
import PricingTable, { PlanKey } from './PricingTable';
import Generator from './Generator';
import { JSX } from 'react';

// Local UI sub-components
const CreditBadge = ({ credits, isUnlimited, onUpgradeClick }: { credits: number; isUnlimited: boolean; onUpgradeClick: () => void }): JSX.Element => (
  <div onClick={onUpgradeClick} className="cursor-pointer px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
    <span className="text-zinc-400">Credits:</span>
    <span className="text-white">{isUnlimited ? '∞ Unlimited' : credits}</span>
  </div>
);

export const DashboardContent = (): JSX.Element => {
  // 1. User & Subscription States
  const [subscriptionTier, setSubscriptionTier] = useState<string>('Free');
  const [isUnlimited, setIsUnlimited] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(0);
  const [loginMessage] = useState<string | null>(null);

  // 2. UI States
  const [activeTab, setActiveTab] = useState<string>('create');
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  // 3. Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 4. Real-time Firestore Listener
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSubscriptionTier(data.subscriptionTier || 'Free');
        setIsUnlimited(Boolean(data.isUnlimited));
        setCredits(data.credits ?? 0);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePlanSelection = async (planKey: PlanKey, priceId: string) => {
    setLoadingPlan(planKey);
    try {
      // Stripe checkout redirect logic using priceId
      console.log('Selected plan:', planKey, 'Price ID:', priceId);
    } catch (err) {
      console.error(err);
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
            <img src="/Viralook.png" alt="Viralook Logo" className="h-full w-auto object-contain" />
          </div>
          <span className="text-white text-lg font-black uppercase tracking-widest border-l border-zinc-800 pl-3">
            Viralook AI Studio
          </span>
        </div>

        {/* RIGHT SIDE BADGES / NAV */}
        <div className="flex items-center gap-4">
          {/* User Tier Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {subscriptionTier}
          </span>

          {/* Upgrade Button */}
          {subscriptionTier !== 'Viral Legend' && !isUnlimited && (
            <button
              type="button"
              onClick={() => setActiveTab('pricing')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Upgrade
            </button>
          )}

          <CreditBadge
            credits={credits}
            isUnlimited={isUnlimited}
            onUpgradeClick={() => setActiveTab('pricing')}
          />

          {/* LOGOUT BUTTON */}
          <button
            type="button"
            onClick={handleLogout}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-bold py-2 px-3 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Logout
          </button>
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
            className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'create' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Studio Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'feed' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Global Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'pricing' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Plans & Billing
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {activeTab === 'create' && <Generator />}

        {activeTab === 'feed' && (
          <div className="space-y-6 py-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-widest"> Community Creations </h2>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest"> Real-time output stream </span>
            </div>

            <GlobalFeed />
          </div>
        )}

        {activeTab === 'pricing' && (
          <PricingTable onSelectPlan={handlePlanSelection} loadingPlan={loadingPlan} />
        )}
      </main>

      {/* FOOTER NAV */}
      <footer className="p-6 border-t border-zinc-900 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
        <span>Viralook AI Studio &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default DashboardContent;