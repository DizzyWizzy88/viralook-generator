export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebaseAdmin";

export default async function DashboardPage() {
  // Replace with your actual auth logic (e.g. from cookies or session)
  const userId = "XeS5zHvgAch5jp9QDCY7CJ9NjH2"; 

  const adminDb = getAdminDb();
  if (!adminDb) return <div>Database Connection Error</div>;

  const userDoc = await adminDb.collection("users").doc(userId).get();
  const userData = userDoc.data();

  // Mapping to your Firestore screenshot:
  const isLegend = userData?.isUnlimited === true || userData?.tier === 'legend';
  const credits = userData?.credits ?? 0;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto border border-white/10 rounded-3xl p-8 bg-zinc-900/50">
        <h1 className="text-2xl font-black mb-6 italic uppercase tracking-tighter">Studio</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-black rounded-2xl border border-white/5">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Status</p>
            <p className="text-xl font-bold">{isLegend ? "Legend Member" : "Starter"}</p>
          </div>
          <div className="p-6 bg-black rounded-2xl border border-white/5">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Balance</p>
            <p className={`text-2xl font-black ${isLegend ? 'text-blue-500' : 'text-white'}`}>
              {isLegend ? "UNLIMITED" : `${credits} Credits`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
