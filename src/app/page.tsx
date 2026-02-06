"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect to the login page
    router.replace('/login');
  }, [router]);

  // We return a completely empty div that matches your global background.
  // This prevents the "Loading..." text from flashing before the redirect.
  return <div className="min-h-screen bg-black" />;
}
