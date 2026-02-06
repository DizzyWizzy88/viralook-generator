"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  limit, 
  orderBy, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { LogOut, Sparkles, Zap, LayoutGrid } from 'lucide-react';

export default function DashboardContent() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [communityImages, setCommunityImages] = useState<any[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          credits: 2,
          email: currentUser.email,
          createdAt: new Date().toISOString(),
          isUnlimited: false
        });
      }

      const unsubscribeUser = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setCredits(data.credits ?? 0);
          setIsUnlimited(data.isUnlimited ?? false);
        }
      });

      return () => unsubscribeUser();
    });

    // We removed 'orderBy' temporarily to ensure images show up even if timestamps are missing
    const q = query(collection(db, "global_feed"), limit(20));
    
    const unsubscribeFeed = onSnapshot(q, (snap) => {
      setCommunityImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFeed();
    };
  }, [router]);

  const handleGenerate = async () => {
    console.log("DEBUG: handleGenerate triggered"); // Check F12 Console for this!
    if (!prompt) return;
    
    if (!isUnlimited && credits !== null && credits <= 0) {
      alert("Out of credits! Please upgrade.");
      return;
    }

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
        console.log("DEBUG: Generation successful!");
      } else {
        console.error("DEBUG: API Error:", data.error);
        alert(data.error || "Generation failed");
      }
    } catch (err) {
      console.error("DEBUG: Fetch error:", err);
      alert("Error connecting to server.");
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
                <span className="text-blue-400 flex items-center gap-1"><Zap size={14} fill="currentColor"/> UNLIMITED</span>
              ) : (
                <span className={credits === 0 ? "text-red-500" : "text-white"}>{credits} CREDITS</span>
              )}
            </span>
          </div>
          <button onClick={() => signOut(getFirebaseAuth())} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
            <LogOut size={20}/>
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
              disabled={generating || !prompt}
              className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {generating ? "SUMMONING..." : "CREATE VISUAL"}
              <Sparkles size={20} className={generating ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {communityImages.map((img) => (
            <div key={img.id} className="aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-white/5">
              <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
