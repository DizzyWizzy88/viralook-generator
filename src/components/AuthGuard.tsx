"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase'; // Updated Import
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get the auth instance safely
    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // If no user is logged in, send them back to login
        router.push('/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] animate-pulse">
          Verifying Identity...
        </div>
      </div>
    );
  }

  // If we have a user, render the protected content
  return user ? <>{children}</> : null;
}
