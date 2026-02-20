"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Required for the logo
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Importing your specific components
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

    // Real-time listener for user data and credits
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      } else {
        // Sets 2 free credits for new users not yet in the database
        setUserData({ credits: 2 });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-blue-500">
        <LoadingBar progress={45} />
        <p className="mt-4 animate-pulse uppercase tracking-[0.3em] text-[10px] font-bold">
          Initializing Studio
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 overflow-x-hidden">
      
      {/* HEADER: Logo + Text + Credits */}
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          {/* Logo Container */}
          <div className="relative w-12 h-12">
            <Image 
              src="/Viralook.png" 
              alt="Viralook Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Brand Identity */}
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-none">
              VIRALOOK <span className="text-blue-500 italic">STUDIO</span>
            </h1>
            <p className="text-[9px] text-zinc-500 font-bold tracking-[0.3em] uppercase mt-1">
              AI Creative Suite
            </p>
          </div>
        </div>

        <CreditBadge/>
      </header>

      {/* MAIN CONTENT: Vertical Stack */}
      <main className="max-w-4xl mx-auto flex flex-col gap-12">
        
        {/* 1. Generator Card */}

       {/* Find the Generator section and update it to this: */}
       <section className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-1 shadow-2xl">
         <div className="bg-black/20 rounded-[1.8rem] p-6">
           <Generator />
         </div>
       </section>
        
        {/* 2. Pricing & Upgrades Section */}
        <section className="w-full py-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-zinc-800"></div>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black">
              Membership Plans
              </h2>
            <div className="h-[1px] flex-1 bg-zinc-800"></div>
          </div>
          <PricingTable />
        </section>

        {/* 3. Your Creations Gallery */}
        <section className="w-full">
          <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="text-2xl font-bold tracking-tight">Your Creations</h2>
            <button className="text-xs text-blue-500 font-bold hover:underline">View All</button>
          </div>
          <div className="bg-zinc-900/10 rounded-3xl p-2 border border-zinc-800/30">
            <ImageGallery />
          </div>
        </section>

      </main>

      {/* Bottom Padding for Mobile */}
      <div className="h-24" />
    </div>
  );
}
