"use client";
export const dynamic = "force-dynamic";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginSuccess() {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  return <div className="bg-black min-h-screen text-white p-8">Redirecting...</div>;
}
