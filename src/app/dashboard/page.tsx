export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebaseAdmin";
// Import your actual auth method here
// import { getAuthSession } from "@/lib/auth"; 

export default async function DashboardPage() {
  // 1. Get the User ID (Using your test ID for now to ensure it loads)
  const userId = "XeS5zHvgAch5jp9QDCY7CJ9NjH2"; 

  if (!userId) {
    redirect("/");
  }

  // 2. Fetch Data from Firebase
  const adminDb = getAdminDb();
  let userData: any = null;

  if (adminDb) {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    userData = userDoc.data();
  }

  // 3. THE "UNLIMITED" LOGIC
  // This looks at the fields we saw in your Firestore screenshot
  const isLegend = userData?.isUnlimited === true || userData?.tier === 'legend';
  const credits = userData?.credits ?? 0;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-white/20">
      {/* HEADER SECTION */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-black rotate-45" />
          </div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            Studio <span className="text-zinc-500 font-medium not-italic ml-1">Dashboard</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {isLegend ? "Legend Access" : "Standard Access"}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group relative p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Usage Balance</p>
            <h2 className={`text-4xl font-black italic ${isLegend ? 'text-blue-500' : 'text-white'}`}>
              {isLegend ? "UNLIMITED" : `${credits} CREDITS`}
            </h2>
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Current Tier</p>
            <h2 className="text-4xl font-black italic uppercase">
              {isLegend ? "Legend" : "Starter"}
            </h2>
          </div>

          <div className="p-8 rounded-[2rem] bg-white text-black border border-white">
            <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-2">Quick Action</p>
            <h2 className="text-2xl font-black italic uppercase leading-tight">Create New Look</h2>
          </div>
        </div>

        {/* RECENT ACTIVITY PLACEHOLDER (Your old UI likely had this) */}
        <div className="rounded-[2.5rem] border border-white/5 bg-zinc-900/20 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
             <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Ready to go viral?</h3>
          <p className="text-zinc-500 max-w-sm mb-8">Start generating AI looks and they will appear here in your studio history.</p>
          <button className="px-8 py-4 bg-white text-black rounded-full font-black uppercase text-sm hover:scale-105 transition-transform">
            Launch Generator
          </button>
        </div>
      </main>
    </div>
  );
}
