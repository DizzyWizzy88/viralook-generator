import React, { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to handle post-login Firestore checks
  const handleOAuthSuccess = async (user: User) => {
    const db = getFirebaseDb();
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        credits: 2,
        createdAt: serverTimestamp(),
        isUnlimited: false
      });
      navigate("/pricing");
    } else {
      navigate("/dashboard");
    }
  };

  // 1. Standard Email / Password Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("🔥 LOGIN FAILED:", err);
      if (err instanceof FirebaseError) {
        if (
          err.code === 'auth/user-not-found' ||
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/invalid-credential'
        ) {
          setError("Invalid email or password.");
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Google OAuth Handler
  const handleGoogleLogin = async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      await handleOAuthSuccess(result.user);
    } catch (err) {
      console.error("🔥 GOOGLE AUTH FAILED:", err);
      if (err instanceof FirebaseError && err.code === 'auth/popup-blocked') {
        setError("Sign-in popup was blocked by your browser.");
      } else {
        setError("Google sign-in failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">

        {/* BRAND LOGO HEADER */}
        <div className="text-center flex flex-col items-center">
          <Link to="/" className="transition-opacity hover:opacity-90 block mb-2">
            <div className="w-48 max-w-[200px] aspect-square flex items-center justify-center overflow-hidden">
              <img
                src="/Viralook.png"
                alt="Viralook Generator Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Enter the studio</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        {/* EMAIL & PASSWORD FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder:text-zinc-600 outline-none transition-colors tracking-widest font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="PASSWORD"
            className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder:text-zinc-600 outline-none transition-colors tracking-widest font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-[8px] font-black uppercase">
            <span className="bg-black px-2 text-zinc-600 tracking-[0.3em]">OR</span>
          </div>
        </div>

        {/* GOOGLE OAUTH PROVIDER */}
        <div>
          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full bg-zinc-900 border border-white/5 text-white font-black py-3.5 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 cursor-pointer"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google Logo"
              style={{ width: '14px', height: '14px', minWidth: '14px', minHeight: '14px' }}
              className="flex-shrink-0"
            />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* SIGNUP NAVIGATION */}
        <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest">
          New here? <Link to="/signup" className="text-white font-bold hover:text-zinc-200 transition-colors ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
}