"use client";

import React, { useEffect, useState } from 'react';
import { db, getFirebaseAuth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Crown, Zap, Loader2 } from 'lucide-react';

export default function CreditBadge() {
  const [credits, setCredits] = useState<number | null>(null);
  const [isUnlimited, setIsUnlimited] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    
    // Listen for Auth changes
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // Real-time listener for the user's document
        const unsubscribeDoc = onSnapshot(doc(db, "users", user.uid), (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setCredits(data.credits ?? 0);
            setIsUnlimited(data.isUnlimited ?? false);
          }
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) return <Loader2 className="animate-spin text-zinc-700" size={16} />;

  if (isUnlimited) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/50 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)] animate-in fade-in zoom-in duration-500">
        <Crown size={14} className="text-cyan-400 fill-cyan-400" />
        <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">
          Viral Legend
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-full">
      <Zap size={12} className="text-yellow-500 fill-yellow-500" />
      <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">
        {credits ?? 0} Credits
      </span>
    </div>
  );
}
