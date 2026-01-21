"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    // Only redirect if we are in the browser
    if (typeof window !== "undefined") {
      router.push('/login');
    }
  }, [router]);

  return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading VIRALOOK...</div>;
}
