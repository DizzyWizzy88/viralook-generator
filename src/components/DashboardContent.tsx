"use client";
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

export default function DashboardContent({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<any>(null);
  const db = getFirestore();

  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(doc(db, "users", userId), (doc) => {
      if (doc.exists()) setUserData(doc.data());
    });
    return () => unsub();
  }, [userId, db]);

  const hasCredits = (userData?.credits || 0) > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* HEADER: Restoring the Dark Premium Look */}
      <div className="flex justify-between items-center mb-10 bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">My Studio</h1>
          <span className="inline-block mt-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/30">
            {userData?.tier || 'Starter'} Plan
          </span>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Credits</p>
          <p className="text-4xl font-black text-white">{userData?.credits ?? 0}</p>
        </div>
      </div>

      {/* ACTION AREA */}
      <div className="mb-12">
        {hasCredits ? (
          <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-12 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95">
            CREATE NEW LOOK <span className="ml-2 opacity-50 text-sm">-1</span>
          </button>
        ) : (
          <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
            <button onClick={() => window.location.href='/upgrade'} className="bg-slate-900 text-white font-bold py-4 px-10 rounded-xl">
              REFILL CREDITS
            </button>
          </div>
        )}
      </div>

      {/* GALLERY PLACEHOLDER */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Your Gallery</h2>
        <div className="aspect-video bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center border-dashed">
          <p className="text-slate-400 italic font-medium">Your generated photos will appear here...</p>
        </div>
      </div>
    </div>
  );
}
