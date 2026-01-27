"use client";

import { useState } from "react";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        credits: 2, // Latest 2-credit requirement
        isUnlimited: false,
        createdAt: new Date().toISOString(),
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-block p-3 bg-blue-600 rounded-xl mb-4"><Sparkles /></div>
          <h2 className="text-3xl font-black uppercase italic">Create Account</h2>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mt-2">Start with 2 free credits</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input type="email" placeholder="EMAIL" className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl" onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="PASSWORD" className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl" onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest">
            {loading ? "Registering..." : "Join Studio"}
          </button>
        </form>
        <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest">
          Already a member? <Link href="/login" className="text-white underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
