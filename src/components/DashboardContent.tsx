"use client";

import React, { useState, useEffect } from 'react';
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Importing the components we saw in your file list
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

    // Real-time listener for credits and user data
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase Snapshot Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-blue-500">
        <LoadingBar />
        <p className="mt-4 animate-pulse">SYNCING DATA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          VIRALOOK STUDIO
        </h1>
        {/* Pass the actual credits from Firebase to your Badge */}
        <CreditBadge credits={userData?.credits ?? 0} />
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: The Generator Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <Generator />
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Your Creations</h2>
            <ImageGallery />
          </div>
        </div>

        {/* Right Column: Pricing/Credits */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <PricingTable />
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-sm text-blue-400 text-center">
                Need more credits? Upgrade your plan above.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
