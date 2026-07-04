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
import { getFirebaseAuth, getFirebaseDb } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("🔥 LOGIN FAILED:", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();

    const provider = new GoogleAuthProvider();
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          // 💡 Dropped initial new-user payload from 2 to 1 credit!
          credits: 1, 
          createdAt: serverTimestamp(),
          isUnlimited: false
        });
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("🔥 GOOGLE AUTH FAILED:", err);
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">

        {/* BRAND LOGO HEADER */}
        <div className="text-center flex flex-col items-center">
          <Link to="/" className="transition-opacity hover:opacity-90 block mb-2 evaluation-no-underline">
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

        {/* EMAIL/USERNAME ENTRY */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder:text-zinc-600 placeholder:normal-case normal-case outline-none transition-colors tracking-widest font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD ENTRY */}
          <input
            type="password"
            placeholder="PASSWORD"
            className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 px-4 py-3.5 rounded text-[11px] text-white placeholder:text-zinc-600 placeholder:normal-case normal-case outline-none transition-colors tracking-widest font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all cursor-pointer"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>

        {/* OR DIVIDER LINE */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
          <div className="relative flex justify-center text-[8px] font-black uppercase"><span className="bg-black px-2 text-zinc-600 tracking-[0.3em]">OR</span></div>
        </div>

        {/* GOOGLE AUTHENTICATION LINK */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-zinc-900 border border-white/5 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 group cursor-pointer"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google Symbol"
            style={{ width: '14px', height: '14px', minWidth: '14px', minHeight: '14px', display: 'block' }}
            className="flex-shrink-0"
          />
          <span>Continue with Google</span>
        </button>

        {/* BACKWARD REGISTRATION ROUTING - REMOVED UNDERLINE */}
        <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest">
          New here? <Link to="/signup" className="text-white font-bold hover:text-zinc-200 transition-colors ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
}