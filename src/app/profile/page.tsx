"use client";

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '@/lib/firebase/clientApp';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, ShieldCheck, CreditCard, 
  ArrowLeft, Clock, externalLink 
} from 'lucide-react';

export default function ProfilePage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const unsubDoc = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      });

      return () => unsubDoc();
    });
    return () => unsubscribe();
  }, [auth, router, db]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-xs tracking-widest uppercase animate-pulse">Accessing Profile...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all">
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 border border-white/5">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Studio</span>
          </button>
          <div className="text-right">
             <h1 className="text-2xl font-black italic uppercase tracking-tighter">Member Profile</h1>
             <p className="text-[8px] text-blue-500 font-bold uppercase tracking-[0.4em]">Viralook Access ID: {auth.currentUser?.uid.slice(0,8)}</p>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-3xl flex items-center justify-center shadow-2xl">
                  {auth.currentUser?.photoURL ? (
                    <img src={auth.currentUser.photoURL} className="w-full h-full rounded-3xl object-cover" />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{auth.currentUser?.displayName || "Studio Member"}</h2>
                  <p className="text-zinc-500 text-xs flex items-center gap-2">
                    <Mail size={12} /> {auth.currentUser?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                   <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Current Plan</p>
                   <p className="text-sm font-bold flex items-center gap-2">
                     <ShieldCheck size={14} className="text-blue-500" />
                     {userData?.isUnlimited ? "Unlimited Pro" : "Standard Access"}
                   </p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                   <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Available Credits</p>
                   <p className="text-sm font-bold text-white">{userData?.credits || 0} units</p>
                </div>
              </div>
            </div>

            {/* BILLING SECTION */}
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Manage Billing</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Update cards & view invoices</p>
                </div>
              </div>
              <button 
                onClick={() => window.open('https://billing.stripe.com/p/login/test_your_link')}
                className="h-11 px-6 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Stripe Portal
              </button>
            </div>
          </div>

          {/* SIDEBAR LOGS */}
          <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2.5rem]">
             <div className="flex items-center gap-2 mb-6 text-zinc-500">
               <Clock size={14} />
               <span className="text-[9px] font-black uppercase tracking-widest">Activity Log</span>
             </div>
             <div className="space-y-4">
                <div className="border-l border-blue-500/30 pl-4 py-1">
                  <p className="text-[10px] font-bold">Session Started</p>
                  <p className="text-[8px] text-zinc-600 uppercase tracking-tighter">Just now</p>
                </div>
                <div className="border-l border-zinc-800 pl-4 py-1">
                  <p className="text-[10px] font-bold text-zinc-400">Profile Initialized</p>
                  <p className="text-[8px] text-zinc-600 uppercase tracking-tighter">Dec 2025</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
