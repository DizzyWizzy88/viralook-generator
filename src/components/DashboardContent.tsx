"use client";

import React, { useState, useEffect } from 'react';
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Importing your sub-components
import Generator from './Generator';
import CreditBadge from './CreditBadge';
import PricingTable from './PricingTable';
import ImageGallery from './ImageGallery';
import LoadingBar from './LoadingBar';

export default function DashboardContent() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Listen to Firebase for credits
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      } else {
        // Fix: Ensure new users see '2 Credits' instead of 0
        setUserData({ credits: 2 });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-blue-500">
        <LoadingBar progress={45} />
        <p className="mt-4 animate-pulse uppercase tracking-widest text-xs">Initializing Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 overflow-x-hidden">
      {/* Header Area */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black tracking-tighter text-blue-500 italic">
          VIRALOOK STUDIO
        </h1>
        <CreditBadge credits={userData?.credits ?? 0} />
      </div>

      {/* Main Layout: Stacked Top-to-Bottom */}
      <main className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* 1. The AI Generator (Main Focus) */}
        <section className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 shadow-2xl">
          <Generator />
        </section>
        
        {/* 2. Pricing & Upgrades (Centered below generator) */}
        <section className="w-full py-4">
          <div className="text-center mb-6">
            <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-bold">Subscription Plans</h2>
          </div>
          <PricingTable />
        </section>

        {/* 3. The Creations Gallery */}
        <section className="w-full bg-zinc-900/20 border-t border-zinc-800/50 pt-10">
          <h2 className="text-xl font-bold mb-6 px-2">Your Creations</h2>
          <ImageGallery />
        </section>

      </main>

      {/* Footer spacing */}
      <div className="h-20" />
    </div>
  );
}
