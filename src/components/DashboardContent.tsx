"use client";

import { useState, useEffect } from "react";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { LogOut, Sparkles, Zap } from "lucide-react";

export default function DashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [communityImages, setCommunityImages] = useState<any[]>([]);
  const [credits, setCredits] = useState(0);
  const [isUnlimited, setIsUnlimited] = useState(false);

  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user stats (credits/unlimited status)
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setCredits(userDoc.data().credits || 0);
          setIsUnlimited(userDoc.data().isUnlimited || false);
        }
      }
    });

    // Listen to the global feed
    const q = query(collection(db, "global_feed"), orderBy("createdAt", "desc"));
    const unsubscribeFeed = onSnapshot(q, (snapshot) => {
      const imgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCommunityImages(imgs);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFeed();
    };
  }, [auth, db]);

  const handleGenerate = async () => {
    if (!prompt || !user) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId: user.uid }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrompt("");
        // Credits will update automatically if you have a listener on the user doc, 
        // or you can manually decrement here for instant UI feedback.
        if (!isUnlimited) setCredits(prev => Math.max(0, prev - 1));
      } else {
        alert(data.error || "Generation failed");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Something went wrong. Check your connection.");
    } finally {
      setGenerating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <nav className="flex justify-between items-center p-6 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="font-black italic text-2xl uppercase tracking-tighter text-blue-500">Viralook</div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Balance</span>
            <span className="text-sm font-black flex items-center gap-1">
              {isUnlimited ? (
                <span className="text-blue-400 flex items-center gap-1"><Zap size={14} fill="currentColor" /> UNLIMITED</span>
              ) : (
                <span className={credits === 0 ? "text-red-500" : "text-white"}>{credits} CREDITS</span>
              )}
            </span>
          </div>
          <button onClick={() => signOut(auth)} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-8 tracking-tighter">
            Ready to <span className="text-zinc-800">Summon?</span>
          </h1>
          <div className="max-w-2xl mx-auto space-y-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Describe the look..."
              className="w-full bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl text-lg outline-none focus:border-blue-500 transition-all"
            />
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt || (credits <= 0 && !isUnlimited)}
              className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {generating ? "SUMMONING..." : (credits <= 0 && !isUnlimited) ? "OUT OF CREDITS" : "CREATE VISUAL"}
              <Sparkles size={20} className={generating ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {communityImages.map((img) => (
            <div key={img.id} className="aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 relative group">
              <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-[10px] text-white/70 line-clamp-2 uppercase font-bold tracking-tight">{img.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
