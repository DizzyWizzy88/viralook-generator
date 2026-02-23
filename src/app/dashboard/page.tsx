"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from "@/lib/firebase";

// We use dynamic import to prevent "Hydration" errors with Firebase Auth
const DashboardContent = dynamic(() => import('@/components/DashboardContent'), { ssr: false });

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // If not logged in, send them to login
        router.push('/login');
      } else {
        // Store the user and stop the loading spinner
        setUser(user);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-widest">
        INITIALIZING STUDIO...
      </div>
    );
  }

  // Pass the userId as a prop to the actual content component
  return <DashboardContent userId={user?.uid} />;
}
