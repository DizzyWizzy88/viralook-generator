"use client";

import React, { useState, useEffect } from 'react';
import { getAuth, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/user';
import { getFirestore, doc, onSnapshot, collection, query, limit, orderBy } from 'firebase/firestore';
import { app } from '@/lib/firebase/clientApp';
import { useRouter } from 'next/navigation';
import ImageGallery from './ImageGallery';
import PricingTable from './PricingTable';
import { LogOut, Zap, LayoutGrid, Sparkles, Wand2, Globe, CreditCard } from 'lucide-react';

export default function DashboardContent() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [communityImages, setCommunityImages] = useState<any[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loadingText, setLoadingText] = useState("Invoking the AI Gods...");

  const loadingPhrases = [
    "Invoking the AI Gods...",
    "Consulting the Neural Oracles...",
    "Synthesizing visual dopamine...",
    "Bribing the GPU clusters...",
    "Calibrating aesthetic parameters...",
    "Decoding the prompt matrix..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingText(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      const userRef = doc(db, "users", currentUser.uid);
      const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCredits(data.credits || 0);
          setIsUnlimited(data.isUnlimited || false);
        }
      });

      const q = query(collection(db, "global_feed"), orderBy("createdAt", "desc"), limit(10));
      const unsubscribeFeed = onSnapshot(q, (snapshot) => {
        setCommunityImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => {
        unsubscribeUser();
        unsubscribeFeed();
      };
    });
    return () => unsubscribeAuth();
  }, [auth, db, router]);

  const handleSignOut = () => signOut(auth).then(() => router.push('/'));

  const handleBilling = async () => {
    try {
      const response = await fetch("/api/customer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      alert("Billing portal currently unavailable.");
    }
  };

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || loading) return;
    if (!isUnlimited && (credits !== null && credits < 1)) {
      alert("Insufficient credits.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId: user?.uid }),
      });
      const data = await response.json();
      if (data.url) {
        setImages([{ id: Date.now().toString(), url: data.url, prompt }, ...images]);
        setPrompt("");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                <img src="/Viralook.png" alt="Logo" className="h-10 w-auto" />
                <div className="h-8 w-[1px] bg-white/10 mx-2" />
                <span className="font-black italic text-2xl text-blue-500 tracking-tighter uppercase">AI STUDIO</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBilling}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[10px] font-black tracking-widest uppercase text-zinc-400"
              >
                <CreditCard size={14} /> Billing
              </button>

              <div className="bg-zinc-900/80 px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-3">
                <Zap size={14} className="text-blue-500 fill-blue-500" />
                <span className="text-xs font-black tracking-widest text-zinc-200 uppercase">
                  {isUnlimited ? "UNLIMITED" : `${credits} Credits`}
                </span>
              </div>
              <button onClick={handleSignOut} className="p-2.5 hover:bg-red-500/10 rounded-full transition-all text-zinc-500 hover:text-red-500">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12 space-y-32">
          
          {/* Global Feed */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Globe size={14} className="text-zinc-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Global Studio Feed</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {communityImages.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src={img.url} className="w-full h-full object-cover" alt="Community" />
                </div>
              ))}
            </div>
          </section>

          {/* Generator */}
          <section className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500 mb-2">
                <Sparkles size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Viralook v2.0 Engine Active</span>
              </div>
              <h1 className="text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                Design <br/><span className="text-zinc-800">The Future.</span>
              </h1>
            </div>

            <form onSubmit={generateImage} className={`relative max-w-2xl mx-auto group transition-all duration-700 ${loading ? 'scale-95 blur-[1px]' : ''}`}>
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision..."
                className="w-full bg-zinc-900/20 border border-white/10 rounded-[3rem] px-10 py-9 text-xl focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-800"
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-4 top-4 bottom-4 px-12 bg-blue-700 hover:bg-blue-600 disabled:bg-zinc-800 rounded-[2rem] font-black text-xs tracking-widest uppercase flex items-center gap-3 transition-all shadow-xl"
              >
                {loading ? <Wand2 size={16} className="animate-spin" /> : <Zap size={16} />}
                <span>{loading ? loadingText : "Generate"}</span>
              </button>
            </form>
          </section>

          {/* Vault */}
          <section id="vault" className="space-y-10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <LayoutGrid size={18} className="text-blue-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Your Personal Vault</h2>
            </div>
            <ImageGallery images={images} setImages={setImages} />
          </section>

          {/* Pricing */}
          <section id="pricing" className="pt-24 border-t border-white/5">
            <PricingTable />
          </section>
        </main>
      </div>
    </div>
  );
}
