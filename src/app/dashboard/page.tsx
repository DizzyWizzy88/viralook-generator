import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebaseAdmin";

export default async function DashboardPage() {
  // TODO: Replace this with your actual method of getting the logged-in UID
  // e.g., const session = await getSession(); const userId = session.userId;
  const userId = "YOUR_TEST_USER_ID"; // Temporary for testing to stop the crash

  if (!userId) {
    redirect("/");
  }

  let userTier = 'starter';
  let credits = 0;

  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const userDoc = await adminDb.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        // This is the key: your Stripe webhook should update this 'tier' field
        userTier = data?.tier || 'starter';
        credits = data?.credits ?? 0;
      }
    }
  } catch (e) {
    console.error("Firebase Admin Error:", e);
  }

  // TIER LOGIC: This fixes the "97 Credits" issue
  const ui = {
    legend: { label: "Viral Legend", display: "Unlimited", color: "text-blue-500" },
    pro: { label: "Pro Monthly", display: "500 / mo", color: "text-emerald-500" },
    starter: { label: "Starter Plan", display: `${credits} Credits`, color: "text-white" }
  }[userTier as 'legend' | 'pro' | 'starter'] || { label: "Starter Plan", display: `${credits} Credits`, color: "text-white" };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto border border-white/10 rounded-3xl p-8 bg-zinc-900/50 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black italic uppercase">Studio</h1>
          <div className="px-4 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
             <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Active Session</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-black rounded-2xl border border-white/5">
            <p className="text-xs text-zinc-500 uppercase font-black tracking-tighter mb-1">Current Membership</p>
            <p className="text-2xl font-bold">{ui.label}</p>
          </div>
          <div className="p-6 bg-black rounded-2xl border border-white/5">
            <p className="text-xs text-zinc-500 uppercase font-black tracking-tighter mb-1">Available Usage</p>
            <p className={`text-3xl font-black ${ui.color}`}>{ui.display}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
