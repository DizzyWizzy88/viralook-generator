"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; 
import { doc, onSnapshot, collection, query, where, orderBy, limit, updateDoc } from "firebase/firestore";
import { 
  Sparkles, Layers, Zap, Download, Maximize2, RefreshCcw, 
  Globe, User, Share2, Heart, Copy
} from "lucide-react";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("System Ready");
  const [credits, setCredits] = useState<number | string>("...");
  
  // Galleries
  const [personalGallery, setPersonalGallery] = useState<any[]>([]);
  const [communityFeed, setCommunityFeed] = useState<any[]>([]);
  
  const [evolutionStrength, setEvolutionStrength] = useState(0.35);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const deviceId = "user_dev_01"; 

  useEffect(() => {
    // 1. Credits Listener
    const unsubCredits = onSnapshot(doc(db, "users", deviceId), (doc) => {
      setCredits(doc.exists() ? doc.data().credits : 5);
    });

    // 2. Personal Gallery (Private)
    const qPersonal = query(
      collection(db, "generations"),
      where("userId", "==", deviceId),
      orderBy("createdAt", "desc")
    );
    const unsubPersonal = onSnapshot(qPersonal, (snap) => {
      setPersonalGallery(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 3. Community Feed (Public by Choice)
    const qCommunity = query(
      collection(db, "generations"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(12)
    );
    const unsubCommunity = onSnapshot(qCommunity, (snap) => {
      setCommunityFeed(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubCredits(); unsubPersonal(); unsubCommunity(); };
  }, []);

  const togglePublic = async (id: string, currentState: boolean) => {
    await updateDoc(doc(db, "generations", id), { isPublic: !currentState });
  };

  const handleSummon = async () => {
    if (!prompt) return;
    setIsProcessing(true);
    setStatus("Accessing Neural Latents...");
    try {
      await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt, deviceId, type: "summon", isPublic: false }),
      });
      setPrompt("");
    } finally {
      setIsProcessing(false);
      setStatus("System Ready");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* LOGO & HEADER (Unaltered) */}
        <header className="flex justify-between items-center mb-12 p-6 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[40px]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-400 rounded-2xl">
              <Sparkles className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">VIRALOOK</h1>
              <p className="text-[9px] text-cyan-400 font-bold tracking-[0.4em] uppercase mt-1">Neural Runway Studio</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">{credits}<span className="text-cyan-400 text-sm ml-1">CR</span></p>
          </div>
        </header>

        {/* SECTION 1: THE GENERATOR (Your existing workspace) */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[35px] backdrop-blur-md">
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">Design Terminal</h3>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-black/50 border border-white/10 rounded-2xl p-4 text-sm focus:border-cyan-400 transition-all outline-none"
                placeholder="Describe your fashion vision..."
              />
              <button onClick={handleSummon} disabled={isProcessing} className="w-full py-4 bg-white text-black font-black uppercase rounded-2xl hover:bg-cyan-400 transition-all">
                {isProcessing ? "Processing..." : "Summon Vision"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-6 text-zinc-500">
              <User size={16}/> Your Private Archives
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {personalGallery.map((item) => (
                <div key={item.id} className="relative group aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                  <img src={item.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                       onClick={() => togglePublic(item.id, item.isPublic)}
                       className={`p-2 rounded-lg backdrop-blur-md transition-all ${item.isPublic ? 'bg-cyan-400 text-black' : 'bg-black/50 text-white'}`}
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: COMMUNITY VISION (The New Section) */}
        <section className="pt-12 border-t border-white/5">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-black uppercase italic tracking-tighter">
                <Globe className="text-cyan-400" size={24}/> Global Feed
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Curated by the Viralook community</p>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-white transition-colors">View All Connections →</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {communityFeed.map((item) => (
              <div key={item.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                <img src={item.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-3 flex flex-col justify-end">
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setPrompt(item.prompt)}
                      className="p-2 bg-white text-black rounded-lg hover:bg-cyan-400 transition-colors"
                      title="Remix this prompt"
                    >
                      <Copy size={12} />
                    </button>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      <Heart size={10} className="text-pink-500 fill-pink-500" /> 24
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
