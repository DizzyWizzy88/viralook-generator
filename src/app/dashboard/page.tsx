import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebaseAdmin";

export default async function DashboardPage() {
  // 1. Get Auth - must be awaited in Next.js 15
  const authObj = await auth();
  const userId = authObj.userId;

  if (!userId) {
    redirect("/");
  }

  // 2. Initialize variables with safe defaults
  let userData = null;
  let userTier = 'starter';
  let rawCredits = 0;

  // 3. Safe Database Fetch
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const userDoc = await adminDb.collection("users").doc(userId).get();
      if (userDoc.exists) {
        userData = userDoc.data();
        userTier = userData?.tier || 'starter';
        rawCredits = userData?.credits ?? 0;
      }
    }
  } catch (error) {
    console.error("Firebase fetch error:", error);
    // Page continues to load with 'starter' defaults instead of crashing
  }

  // 4. UI Config logic
  const tierConfigs: Record<string, { label: string; display: string; color: string }> = {
    legend: { label: "Viral Legend", display: "Unlimited", color: "text-blue-500" },
    pro: { label: "Pro Monthly", display: "500 / mo", color: "text-emerald-500" },
    starter: { label: "Starter Plan", display: `${rawCredits} Credits`, color: "text-white" }
  };

  const current = tierConfigs[userTier] || tierConfigs.starter;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Viralook Studio</h1>
            <p className="text-gray-500 text-sm">Welcome to your creative dashboard</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            {/* CREDIT CARD */}
            <div className="flex-1 md:w-48 bg-[#111] border border-white/10 p-4 rounded-2xl shadow-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Balance</p>
              <p className={`text-2xl font-black mt-1 ${current.color}`}>{current.display}</p>
            </div>

            {/* TIER CARD */}
            <div className="flex-1 md:w-48 bg-[#111] border border-white/10 p-4 rounded-2xl shadow-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Membership</p>
              <p className="text-lg font-bold mt-1">{current.label}</p>
            </div>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 p-8 bg-zinc-900/50 rounded-3xl border border-white/5 h-64 flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold mb-2">Generator</h2>
            <p className="text-gray-600 text-xs text-center italic">Ready for input...</p>
          </div>
          
          <div className="lg:col-span-2 p-8 bg-zinc-900/50 rounded-3xl border border-white/5 h-64 flex flex-col justify-center items-center text-center">
            <h2 className="text-xl font-bold mb-2">Your Creations</h2>
            <p className="text-gray-600 text-xs italic">No images generated yet</p>
          </div>
        </div>

      </div>
    </div>
  );
}
