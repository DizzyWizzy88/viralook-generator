"use client";

import React, { useEffect } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged 
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

export default function LoginPage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Business Logic: Check if this is a first-time user
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Welcome Pack: Grant 5 Free Credits for new accounts
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          credits: 5,           // The "Welcome" Gift
          isUnlimited: false,
          currentTier: "Free",
          createdAt: serverTimestamp(),
        });
        console.log("New account created: 5 credits granted.");
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login Error:", error.message);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans overflow-hidden">
      
      {/* Cinematic Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-12 text-center">
        <div className="space-y-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-6">
            <img 
              src="/Viralook.png" 
              alt="Viralook Logo" 
              className="h-16 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
            />
            <div className="space-y-2">
              <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
                AI <span className="text-blue-500">Studio</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
                Premium Visual Generation
              </p>
            </div>
          </div>

          <div className="h-[1px] w-12 bg-zinc-800 mx-auto" />

          {/* Social Proof / Benefit */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4">
             <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
               Join the community and claim <br/>
               <span className="text-white">5 Free Generations</span> today
             </p>
          </div>

          {/* Login Button */}
          <button 
            onClick={handleGoogleLogin}
            className="group relative w-full py-5 bg-white text-black rounded-3xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-center gap-3">
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" 
                className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all" 
                alt="Google" 
              />
              Continue with Google
            </div>
          </button>

          {/* Legal / Footer */}
          <div className="pt-4">
            <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.2em] leading-loose">
              By continuing, you agree to Viralook's <br/>
              <span className="underline cursor-pointer hover:text-zinc-500">Terms of Service</span> & <span className="underline cursor-pointer hover:text-zinc-500">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
