
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, ArrowLeft, LogOut } from "lucide-react";
import { getFirebaseAuth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserProfile {
  email: string;
  tier?: string;
  isUnlimited?: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getFirebaseAuth();
    
    // 🔐 Real-time active subscription listener for account verification
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              email: currentUser.email || "No Email Provided",
              tier: data?.tier || (data?.isUnlimited ? "legend" : "standard"),
              isUnlimited: data?.isUnlimited || false
            });
          } else {
            // Fallback if the firestore doc isn't built yet
            setUser({ email: currentUser.email || "No Email Provided", tier: "standard" });
          }
        } catch (error) {
          console.error("Error fetching user document details:", error);
        }
      } else {
        // Force redirect to login landing zone if user drops authentication completely
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🚪 Clean session eviction
  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Session logout crash triggered:", error);
    }
  };

  const isLegend = user?.tier === "legend" || user?.isUnlimited === true;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans antialiased">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* TOP HEADER CONTROLS */}
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-900 rounded-lg transition-all border border-transparent hover:border-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Profile Settings</h1>
        </div>

        {/* METRICS & CREDENTIAL CONTAINER CARD */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4 shadow-xl">
          
          {/* USER TIER BADGE FIELD */}
          <div className="flex items-center space-x-4 border-b border-zinc-900 pb-4">
            <User className="text-zinc-600" size={24} />
            <div>
              <p className="text-[8px] text-zinc-600 uppercase tracking-widest font-black">Account Type</p>
              <p className={`font-bold text-xs uppercase tracking-wider ${isLegend ? "text-cyan-400 italic" : "text-zinc-400"}`}>
                {loading ? "Verifying Status..." : (isLegend ? "Legend Studio Member" : "Standard Studio Member")}
              </p>
            </div>
          </div>

          {/* SECURE EMAIL READOUT FIELD */}
          <div className="flex items-center space-x-4">
            <Mail className="text-zinc-600" size={24} />
            <div>
              <p className="text-[8px] text-zinc-600 uppercase tracking-widest font-black">Email Address</p>
              <p className="text-xs font-medium text-zinc-300 tracking-wide">
                {loading ? "Loading Session Details..." : (user?.email)}
              </p>
            </div>
          </div>
          
        </div>

        {/* LOGOUT INTERACTIVE CONTROL BUTTON */}
        <button 
          onClick={handleSignOut}
          className="w-full bg-zinc-950 border border-red-900/40 text-red-500 hover:text-red-400 font-bold py-4 rounded-xl uppercase tracking-[0.2em] hover:bg-red-950/20 active:scale-98 transition-all flex items-center justify-center space-x-2 text-[11px]"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
        
      </div>
    </div>
  );
}