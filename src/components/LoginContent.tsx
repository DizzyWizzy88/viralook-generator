"use client";

import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase'; // Fixed Import
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not, create them with 2 credits
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          credits: 2,
          createdAt: serverTimestamp(),
          isUnlimited: false
        });
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-block p-3 bg-zinc-900 rounded-2xl mb-4 border border-white/5">
            <Sparkles className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Welcome Back</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Enter the studio</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="EMAIL" 
            className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-blue-500/50 transition-all text-[11px] font-black tracking-widest uppercase"
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-blue-500/50 transition-all text-[11px] font-black tracking-widest uppercase"
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
          <div className="relative flex justify-center text-[8px] font-black uppercase"><span className="bg-black px-2 text-zinc-600 tracking-[0.3em]">OR</span></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-zinc-900 border border-white/5 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all"
        >
          Continue with Google
        </button>

        <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest">
          New here? <Link href="/signup" className="text-white underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
