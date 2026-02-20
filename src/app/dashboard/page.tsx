export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebaseAdmin";

export default async function DashboardPage() {
  // Replace with your actual auth logic
  const userId = "XeS5zHvgAch5jp9QDCY7CJ9NjH2"; 

  let userData: any = null;
  const adminDb = getAdminDb();
  
  if (adminDb) {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    userData = userDoc.data();
  }

  const isUnlimited = userData?.isUnlimited === true;
  const userTier = userData?.tier || 'starter';
  const credits = userData?.credits ?? 0;

  // Define the structure for TypeScript
  interface TierConfig {
    label: string;
    display: string;
    color: string;
  }

  const ui: Record<string, TierConfig> = {
    legend: { label: "Viral Legend", display: "Unlimited", color: "text-blue-500" },
    pro: { label: "Pro Monthly", display: "500 / mo", color: "text-emerald-500" },
    starter: { label: "Starter Plan", display: `${credits} Credits`, color: "text-white" }
  };

  // Determine current UI state
  const current = isUnlimited ? ui.legend : (ui[userTier] || ui.starter);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8 uppercase italic">Studio Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Usage Plan</p>
            <p className="text-2xl font-bold">{current.label}</p>
          </div>

          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Remaining Balance</p>
            <p className={`text-4xl font-black ${current.color}`}>{current.display}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
