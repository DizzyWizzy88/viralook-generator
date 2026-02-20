"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Loader2, Globe, ZoomIn } from 'lucide-react';

interface FeedItem {
  id: string;
  imageUrl: string;
  prompt: string;
  userName: string;
  createdAt: string;
}

export default function ImageGallery() {
  const [images, setImages] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query the global_feed collection, newest first
    const q = query(
      collection(db, "global_feed"),
      orderBy("createdAt", "desc"),
      limit(24)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FeedItem[];
      
      setImages(feedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-zinc-700" size={32} />
        <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Syncing with the void...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Globe size={16} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-sm font-black tracking-widest uppercase text-white">Global Live Feed</h2>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Latest Summonings from the community</p>
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 px-4 space-y-4">
        {images.map((img) => (
          <div 
            key={img.id} 
            className="relative break-inside-avoid rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <img 
              src={img.imageUrl} 
              alt={img.prompt}
              className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full" />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">
                  {img.userName}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed italic mb-3">
                "{img.prompt}"
              </p>
              <div className="flex items-center gap-1 text-cyan-400">
                <ZoomIn size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">View Masterpiece</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
          <p className="text-zinc-600 font-black uppercase text-xs tracking-widest">The gallery is currently empty.</p>
        </div>
      )}
    </div>
  );
}
