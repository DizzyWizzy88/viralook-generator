"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase'; // Updated Import
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initAuth = async () => {
      try {
        // Get the auth instance safely
        const auth = getFirebaseAuth();

        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (!currentUser) {
            // If no user is logged in, send them back to login
            router.push('/login');
          } else {
            setUser(currentUser);
          }
          setLoading(false);
        }, (error) => {
          // Handle auth errors
          console.error('Auth state change error:', error);
          setError(error.message);
          setLoading(false);
          router.push('/login');
        });
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">
            Authentication Error
          </div>
          <p className="text-zinc-400 text-xs mt-2">{error}</p>
        </div>
      </div>
    );
  }

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
