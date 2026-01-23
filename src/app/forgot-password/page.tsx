"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox for a reset link!");
      setError("");
    } catch (err: any) {
      setError("Could not send reset email. Check the address.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {message && <p className="text-green-500 mb-4 text-sm">{message}</p>}
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 py-3 rounded-lg font-bold">
            Send Reset Link
          </button>
        </form>
        <Link href="/login" className="block text-center mt-4 text-sm text-zinc-400 hover:text-white">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
