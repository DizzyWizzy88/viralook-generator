"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center shadow-2xl">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full text-4xl animate-bounce">
          ⚡
        </div>
        
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Welcome, Viral Legend!
        </h1>
        
        <p className="text-purple-200 mb-8">
          Your payment was successful. You now have <strong>unlimited</strong> AI summoning power.
        </p>

        <Link 
          href="/dashboard"
          className="block w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-purple-500/20"
        >
          Back to the Studio
        </Link>
        
        <p className="mt-6 text-sm text-purple-300/50">
          It may take a few seconds for your status to update.
        </p>
      </div>
    </div>
  );
}
