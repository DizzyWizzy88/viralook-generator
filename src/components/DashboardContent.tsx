"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { getAuth, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, query, limit, orderBy } from 'firebase/firestore';
import { app } from '@/lib/firebase/clientApp';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import ImageGallery from './ImageGallery';
import PricingTable from './PricingTable';
import { LogOut, Zap, LayoutGrid, Sparkles, Wand2, Globe, CreditCard, CheckCircle2, Monitor, User, Camera, Ghost, Circle } from 'lucide-react';

export default function DashboardContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState("CINEMATIC");

  const categories = [
    { id: "CINEMATIC", icon: <Camera size={14}/> },
    { id: "PORTRAIT", icon: <User size={14}/> },
    { id: "ANIME", icon: <Ghost size={14}/> },
    { id: "FANTASY", icon: <Sparkles size={14}/> },
    { id: "MINIMALIST", icon: <Circle size={14}/> },
  ];

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      window.history.replaceState({}, '', '/dashboard');
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) { router.push('/login'); return; }
      setUser(currentUser);
      const userRef = doc(db, "users", currentUser.uid);
      const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCredits(data.credits || 0);
          setIsUnlimited(data.isUnlimited || false);
        }
      });
      const q = query(collection(db, "global_feed"), orderBy("createdAt", "desc"), limit(15));
      const unsubscribeFeed = onSnapshot(q, (snapshot) => {
        setCommunityImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => { unsubscribeUser(); unsubscribeFeed(); };
    });
    return () => unsubscribeAuth();
  }, [auth, db, router]);

  const handleSignOut = () => signOut(auth).then(() => router.push('/'));
  const handleRemix = (p: string) => { setPrompt(p); window.scrollTo({ top: 400, behavior: 'smooth' }); };

  const handleBilling = async () => {
    const res = await fetch("/api/customer-portal", { method: "POST", body: JSON.stringify({ userId: user?.uid }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || loading) return;
    if (!isUnlimited && (credits || 0) < 1) { alert("Insufficient credits."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST", body: JSON.stringify({ prompt, userId: user?.uid, category: activeCategory }) });
      const data = await res.json();
      if (data.url) { setImages([{ id: Date.now().toString(), url: data.url, prompt }, ...images] as any); setPrompt(""); }
    } finally { setLoading(false); }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">
      
      {/* 1. SLIM NAV (Matching image_102143.jpg) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10">
                <img src="/Viralook.png" alt="Logo" className="w-6 h-6 object-contain" />
             </div>
             <h1 className="text-xl font-black tracking-tighter italic uppercase">
               Viralook <span className="text-blue-500">Studio</span>
             </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-zinc-900/80 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                {isUnlimited ? "Unlimited" : `${credits} Credits`}
              </span>
            </div>
            <button onClick={handleBilling} className="text-[11px] font-black uppercase tracking-widest text-blue-500 hover:text-white transition-all">Get More</button>
            <button onClick={handleSignOut} className="p-2 text-zinc-600 hover:text-white transition-all"><LogOut size={20}/></button>
          </div>
        </div>
      </nav>

      <div className="pt-40 max-w-6xl mx-auto px-6 space-y-32">
        
        {/* 2. HERO SECTION (Matching image_102143.jpg) */}
        <header className="text-center space-y-8">
          <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9]">
            Visualize <span className="text-zinc-600">Everything.</span>
          </h1>
          <p className="max-w-xl mx-auto text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] leading-relaxed">
            The high-fidelity AI engine for everyone. Generate cinematic art, portraits, and concepts in 2k resolution.
          </p>
          
          {/* Category Toggles */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  activeCategory === cat.id 
                  ? "bg-blue-600 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]" 
                  : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20"
                }`}
              >
                {cat.icon} {cat.id}
              </button>
            ))}
          </div>
        </header>

        {/* 3. GENERATOR BAR (Matching image_102143.jpg) */}
        <section className="relative max-w-4xl mx-auto">
          <form onSubmit={generateImage} className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-4 flex items-center gap-4 focus-within:border-blue-500/50 transition-all shadow-2xl">
            <input 
              type="text" value={prompt} onChange={(e)=>setPrompt(e.target.value)} 
              placeholder="What do you want to see?"
              className="flex-1 bg-transparent border-none px-6 py-4 text-zinc-300 placeholder:text-zinc-700 focus:ring-0 text-lg"
            />
            
            {/* Aspect Ratio Simulator */}
            <div className="hidden md:flex items-center gap-3 px-4 border-l border-white/10 text-[10px] font-black text-zinc-600">
              <span className="text-white">1:1</span> <span>4:5</span> <span>16:9</span>
            </div>

            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all">
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>
          <p className="mt-6 text-[9px] text-zinc-700 font-black uppercase tracking-[0.4em] text-center">Press Enter to visualize your concept</p>
        </section>

        {/* 4. FEED & VAULT (Keep same logic) */}
        <section className="space-y-20">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <Globe size={16} className="text-blue-500" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Global Feed — Tap to Remix</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
            {communityImages.map((img, i) => (
              <div key={i} onClick={()=>handleRemix(img.prompt)} className="group relative flex-shrink-0 w-44 h-44 rounded-2xl overflow-hidden border border-white/5 cursor-pointer">
                <img src={img.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Sparkles /></div>
              </div>
            ))}
          </div>

          <div className="space-y-12">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <LayoutGrid size={16} className="text-blue-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Personal Vault</h2>
            </div>
            <ImageGallery images={images} setImages={setImages} />
          </div>
        </section>

        {/* 5. PRICING (Matching Screenshot 2025-12-23 1.47.28 PM.jpg) */}
        <section id="pricing" className="py-32 border-t border-white/5">
           <div className="text-center mb-20 space-y-4">
              <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Choose your power</span>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Ready to go <span className="text-blue-500">Viral?</span></h2>
           </div>
           <PricingTable />
        </section>
      </div>
    </div>
  );
}
