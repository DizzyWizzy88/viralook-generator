import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebaseAdmin";
import GeneratorForm from "@/components/GeneratorForm"; // Adjust path if needed
import Gallery from "@/components/Gallery"; // Adjust path if needed

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const adminDb = getAdminDb();
  const userDoc = await adminDb!.collection("users").doc(userId).get();
  const userData = userDoc.data();

  // --- TIER & CREDIT LOGIC ---
  const userTier = userData?.tier || 'starter';
  const rawCredits = userData?.credits || 0;

  let creditDisplay = "";
  let tierLabel = "";
  let colorClass = "";

  if (userTier === 'legend') {
    creditDisplay = "Unlimited";
    tierLabel = "Viral Legend";
    colorClass = "text-blue-500"; 
  } else if (userTier === 'pro') {
    creditDisplay = "500 / mo";
    tierLabel = "Pro Monthly";
    colorClass = "text-emerald-500";
  } else {
    creditDisplay = `${rawCredits} Credits`;
    tierLabel = "Starter Plan";
    colorClass = "text-white";
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">AI STUDIO</h1>
            <p className="text-gray-500 text-sm">Create your next viral masterpiece.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            {/* CREDIT DISPLAY */}
            <div className="flex-1 md:w-48 bg-[#111] border border-white/10 p-4 rounded-2xl shadow-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Balance</p>
              <p className={`text-2xl font-black mt-1 ${colorClass}`}>{creditDisplay}</p>
            </div>

            {/* TIER DISPLAY */}
            <div className="flex-1 md:w-48 bg-[#111] border border-white/10 p-4 rounded-2xl shadow-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Membership</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg font-bold truncate">{tierLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* GENERATOR SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <GeneratorForm userTier={userTier} credits={rawCredits} />
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Your Creations</h2>
            <Gallery userId={userId} />
          </div>
        </div>

      </div>
    </div>
  );
}
