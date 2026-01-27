"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, collection, query, limit, orderBy, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import LoadingBar from './LoadingBar';
import { LogOut, Camera, Sparkles } from 'lucide-react';

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
  const [communityImages, setCommunityImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Sync User Data
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          credits: 2, // Ensure 2 for first-time Google logins too
          email: currentUser.email,
          createdAt: new Date().toISOString(),
          isUnlimited: false
        });
      }

      onSnapshot(userRef, (snap) => {
        if (snap.exists()) setCredits(snap.data().credits ?? 0);
      });
    });

    // Global Feed Sync - Wrapped safely
    const q = query(collection(db, "global_feed"), orderBy("createdAt", "desc"), limit(15));
    const unsubscribeFeed = onSnapshot(q, (snap) => {
      setCommunityImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFeed();
    };
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex justify-between items-center mb-12">
        <div className="font-black italic text-xl uppercase tracking-tighter">Viralook</div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold bg-zinc-900 px-3 py-1 rounded-full border border-white/10">
            {credits} CREDITS
          </span>
          <button onClick={() => signOut(getFirebaseAuth())}><LogOut size={18}/></button>
        </div>
      </nav>
      {/* ... Rest of your Dashboard UI ... */}
      <div className="text-center py-20">
        <h1 className="text-6xl font-black uppercase italic mb-8">Ready to <span className="text-zinc-800">Summon?</span></h1>
        {/* Input and Button logic here */}
      </div>
    </div>
  );
}
