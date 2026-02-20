import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebaseAdmin";

export default async function DashboardPage() {
  // 1. Get Auth (Awaiting for Next.js 15 compatibility)
  const { userId } = await auth();
  if (!userId) redirect("/");

  let userData: any = null;

  // 2. Safely Fetch Data
  try {
    const adminDb = getAdminDb();
    if (!adminDb) {
      throw new Error("Firebase Admin not initialized");
    }
    const userDoc = await adminDb.collection("users").doc(userId).get();
    userData = userDoc.data();
  } catch (error) {
    console.error("Dashboard Data Fetch Error:", error);
    // We don't crash, we just fall back to 'starter'
  }

  // 3. Logic for Tiers (Defaults to Starter if DB fails)
  const userTier = userData?.tier || 'starter';
  const rawCredits = userData?.credits ?? 0;

  const tierConfigs = {
    legend: { label: "Viral Legend", display: "Unlimited", color: "text-blue-500" },
    pro: { label: "Pro Monthly", display: "500 / mo", color: "text-emerald-500" },
    starter: { label: "Starter Plan", display: `${rawCredits} Credits`, color: "text-white" }
  };

  const currentTier = tierConfigs[userTier as keyof typeof tierConfigs] || tierConfigs.starter;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Viralook Studio</h1>
            <p className="text-gray-500 text-sm">Dashboard Status: <span className="text-green-500 font-mono text-xs">ONLINE</span></p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-48 bg-[#111] border border-white/10 p-4 rounded-2xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Balance</p>
              <p className={`text-2xl font-black mt-1 ${currentTier.color}`}>{currentTier.display}</p>
            </div>

            <div className="flex-1 md:w-48 bg-[#111] border border-white/10 p-4 rounded-2xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Membership</p>
              <p className="text-lg font-bold mt-1">{currentTier.label}</p>
            </div>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 p-8 bg-[#111] rounded-3xl border border-white/5 h-64 flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold mb-2">Generator</h2>
            <p className="text-gray-600 text-xs text-center italic">Ready to create</p>
          </div>
          
          <div className="lg:col-span-2 p-8 bg-[#111] rounded-3xl border border-white/5 h-64 flex flex-col justify-center items-center text-center">
            <h2 className="text-xl font-bold mb-2">Creations</h2>
            <p className="text-gray-600 text-xs italic">Your gallery will appear here</p>
          </div>
        </div>

      </div>
    </div>
  );
}
