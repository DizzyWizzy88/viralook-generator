"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Calendar, ArrowLeft, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initProfile = async () => {
      try {
        // Safe dynamic imports for Firebase
        const { getFirebaseAuth } = await import("@/lib/firebase");
        const { onAuthStateChanged, signOut } = await import("firebase/auth");
        
        const auth = getFirebaseAuth();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
          } else {
            router.push('/login');
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Profile initialization error:", error);
        setLoading(false);
      }
    };

    initProfile();
  }, [router]);

  const handleSignOut = async () => {
    const { getFirebaseAuth } = await import("@/lib/firebase");
    const { signOut } = await import("firebase/auth");
    await signOut(getFirebaseAuth());
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-blue-500 font-black tracking-widest animate-pulse">LOADING PROFILE...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto pt-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Back to Studio</span>
        </Link>

        <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/20">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Account</h1>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Personal Settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] block mb-2">Email Address</label>
              <div className="flex items-center gap-3 text-sm font-bold">
                <Mail size={14} className="text-blue-500" />
                {user?.email}
              </div>
            </div>

            <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] block mb-2">Member Since</label>
              <div className="flex items-center gap-3 text-sm font-bold">
                <Calendar size={14} className="text-blue-500" />
                {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="w-full bg-zinc-800 hover:bg-red-500/10 hover:text-red-500 text-zinc-400 font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl transition-all border border-transparent hover:border-red-500/20 flex items-center justify-center gap-3"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
