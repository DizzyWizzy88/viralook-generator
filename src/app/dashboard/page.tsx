"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from "@/lib/firebase";

const DashboardContent = dynamic(() => import('@/components/DashboardContent'), { ssr: false });

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getFirebaseAuth();
    // This listener is the secret to smooth transitions
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-black animate-pulse">
        INITIALIZING STUDIO...
      </div>
    );
  }

  return <DashboardContent />;
}
