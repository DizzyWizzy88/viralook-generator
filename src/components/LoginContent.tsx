"use client";

import React, { useState } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { app } from '@/lib/firebase/clientApp';
import { useRouter } from 'next/navigation';

export default function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      alert("Login failed. Check your credentials.");
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // AUTO-SIGNUP LOGIC: Check if user document exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create the user document with 5 starter credits
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          credits: 5,
          createdAt: serverTimestamp(),
        });
        console.log("New user document created with 5 credits!");
      }

      router.push('/dashboard');
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google login failed. Please check if popups are blocked.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 bg-zinc-900/50 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl">
        <div className="text-center space-y-2">
          <img src="/Viralook.png" alt="Viralook" className="h-8 mx-auto mb-4" />
          <h2 className="text-3xl font-black tracking-tighter text-white italic uppercase">Welcome Back</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Enter the Studio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="EMAIL ADDRESS" 
            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-zinc-700"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-zinc-700"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 tracking-[0.2em] text-[10px]">
            SIGN IN
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]"><span className="bg-zinc-900 px-4 text-zinc-600">OR</span></div>
        </div>

        <button 
          type="button"
          onClick={loginWithGoogle} 
          className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 text-[10px] tracking-[0.2em] shadow-2xl active:scale-95"
        >
          CONTINUE WITH GOOGLE
        </button>
      </div>
    </div>
  );
}
