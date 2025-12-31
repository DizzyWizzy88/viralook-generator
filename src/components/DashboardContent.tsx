"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { 
  getAuth, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, doc, onSnapshot, collection, query, limit, orderBy, 
  getDoc, setDoc, where 
} from 'firebase/firestore';
import { app } from '@/lib/firebase/clientApp';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import ImageGallery from './ImageGallery';
import PricingTable from './PricingTable';
import { 
  LogOut, LayoutGrid, Globe, User, 
  Camera, Ghost, Circle, Sparkles 
} from 'lucide-react';

export default function DashboardContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-black tracking-widest uppercase text-xs animate-pulse">Initializing Studio...</div>}>
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [communityImages, setCommunityImages] = useState<any[]>([]);
  const [prompt, setPrompt] = useState("");
  const [activeCategory, setActiveCategory] = useState("CINEMATIC");

  const categories = [
    { id: "CINEMATIC", icon: <Camera size={14}/> },
    { id: "PORTRAIT", icon: <User size={14}/> },
    { id: "ANIME", icon: <Ghost size={14}/> },
    { id: "FANTASY", icon: <Sparkles size={14}/> },
    { id: "MINIMALIST", icon: <Circle size={14}/> },
  ];

  // 1. Auth & User Data
  useEffect(() => {
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
          credits: 5,
          email: currentUser.email,
          createdAt: new Date().toISOString(),
          isUnlimited: false
        });
      }

      return onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCredits(data.credits ?? 0);
          setIsUnlimited(data.isUnlimited ?? false);
        }
      });
    });
    return () => unsubscribeAuth();
  }, [auth, db, router]);

  // 2. Filtered Global Feed Logic
  useEffect(() => {
    // Queries images that match the selected category
    const q = query(
      collection(db, "global_feed"), 
      where("category", "==", activeCategory),
      orderBy("createdAt", "desc"), 
      limit(15)
    );

    const unsubscribeFeed = onSnapshot(q, (snapshot) => {
      setCommunityImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.warn("Feed error (likely missing index):", error);
      // Fallback to unfiltered feed if index isn't ready yet
      const fallbackQ = query(collection(db, "global_feed"), orderBy("createdAt", "desc"), limit(15));
      onSnapshot(fallbackQ, (s) => setCommunityImages(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    });

    return () => unsubscribeFeed();
  }, [db, activeCategory]);

  const handleSignOut = () => signOut(auth).then(() => router.push('/'));
  
  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { 
        method: "POST", 
        body: JSON.stringify({ prompt, userId: user?.uid, category: activeCategory }) 
      });
      const data = await res.json();
      if (data.url) {
        setImages([{ id: Date.now().toString(), url: data.url, prompt }, ...images] as any);
        setPrompt("");
        confetti({ particleCount: 40, velocity: 30, spread: 360, colors: ['#3b82f6', '#ffffff'] });
      }
    } finally { setLoading(false); }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black italic tracking-tighter uppercase">Viralook</span>
              <span className="text-[8px] font-bold text-blue-500 tracking-[0.3em] uppercase">AI Studio</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex bg-zinc-900/50 px-4 py-2 rounded-full border border-white/10 items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {isUnlimited ? "Unlimited" : `${credits} Credits`}
              </span>
            </div>
            <button onClick={() => router.push('/profile')} className="w-10 h-10 rounded-full border border-white/20 overflow-hidden hover:scale-105 transition-transform">
              <img src={user?.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.uid}`} alt="User" />
            </button>
            <button onClick={handleSignOut} className="text-zinc-500 hover:text-white transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-40 max-w-6xl mx-auto px-6 space-y-32 pb-20">
        <header className="text-center space-y-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-7xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
            Visualize <span className="text-zinc-800">Everything.</span>
          </motion.h1>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                  activeCategory === cat.id ? "bg-blue-600 border-blue-500 shadow-lg" : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20"
                }`}
              >
                {cat.icon} {cat.id}
              </button>
            ))}
          </div>
        </header>

        <section className="max-w-4xl mx-auto">
          <form onSubmit={generateImage} className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-3 flex items-center gap-4 focus-within:border-blue-500/50 transition-all">
            <input type="text" value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder={`Describe your ${activeCategory.toLowerCase()} vision...`} className="flex-1 bg-transparent border-none px-6 py-4 text-white placeholder:text-zinc-700 focus:ring-0 text-lg" />
            <button type="submit" disabled={loading} className="bg-white text-black hover:bg-zinc-200 px-10 py-5 rounded-[1.8rem] font-black uppercase text-[11px] tracking-widest transition-all disabled:opacity-50">
              {loading ? "Processing..." : "Generate"}
            </button>
          </form>
        </section>

        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <Globe size={14} className="text-blue-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Inspiration: {activeCategory}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {communityImages.map((img) => (
              <div key={img.id} className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-zinc-900">
                <img src={img.url} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" alt="Community" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <LayoutGrid size={14} className="text-blue-500" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Your Private Vault</h2>
          </div>
          <ImageGallery images={images} setImages={setImages} />
        </section>

        <PricingTable userId={user?.uid} />
      </main>
    </div>
  );
}
