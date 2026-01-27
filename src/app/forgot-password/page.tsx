"use client";

import { useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase"; // Updated Import
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const auth = getFirebaseAuth(); // Use Getter

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
            <Sparkles size={24} className="text-blue-500" />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-center">Reset <br/>Password</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Enter your email to recover access</p>
        </div>

        {message && (
          <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded-xl text-blue-500 text-[10px] font-black uppercase tracking-widest text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl outline-none focus:border-blue-500/50 transition-all text-[11px] font-black tracking-widest uppercase"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] py-5 rounded-xl hover:bg-zinc-200 transition-all"
          >
            {loading ? "SENDING..." : "SEND RESET LINK"}
          </button>
        </form>

        <Link href="/login" className="flex items-center justify-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
          <ArrowLeft size={12} /> Back to Login
        </Link>
      </div>
    </div>
  );
}
