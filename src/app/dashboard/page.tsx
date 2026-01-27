"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// We use dynamic loading to ensure the dashboard doesn't break during the Android static build
const DashboardContent = dynamic(
  () => import('@/components/DashboardContent'),
  { 
    ssr: false, 
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-black tracking-widest uppercase text-xs animate-pulse">
        Initializing Studio...
      </div>
    ) 
  }
);

export default function DashboardPage() {
  return <DashboardContent />;
}
