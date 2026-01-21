"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState("...");
  const router = useRouter();

  useEffect(() => {
    const initFirebase = async () => {
      // Dynamically import to keep it away from the build worker
      const { auth } = await import("@/lib/firebase");
      const { onAuthStateChanged } = await import("firebase/auth");
      
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserEmail(user.email || "No email");
        } else {
          router.push('/login');
        }
      });
    };
    initFirebase();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-black">USER PROFILE</h1>
      <p className="mt-4 text-zinc-400">Account: {userEmail}</p>
      <button 
        onClick={() => router.push('/dashboard')}
        className="mt-8 px-6 py-2 bg-white text-black font-bold rounded-full"
      >
        BACK TO STUDIO
      </button>
    </div>
  );
}
