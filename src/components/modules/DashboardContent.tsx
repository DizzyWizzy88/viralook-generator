import { useEffect, useState } from 'react';

// 1. Vite/React replacements for Next.js modules
// Replace `next/navigation` searchParams with standard URLSearchParams in Vite
// Replace `next/image` with standard <img> tags or standard UI components

// 2. Local module imports (Adjust relative paths if these components are located in src/components/ instead)
import Generator from './Generator';
import CreditBadge from './CreditBadge';
import PricingTable from './PricingTable';
import ImageGallery from './ImageGallery';
import LoadingBar from './LoadingBar';

interface UserData {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown; // Replaced 'any' with 'unknown' for TypeScript safety
}

interface DashboardContentProps {
  userData?: UserData;
}

export default function DashboardContent({ userData }: DashboardContentProps) {
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  // Read URL search parameters natively in Vite
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const loginParam = searchParams.get('login');

    if (loginParam === 'success') {
      // Async state update prevents cascading re-render warnings in React effects
      const timer = setTimeout(() => {
        setLoginMessage('Welcome back! You have successfully logged in.');
      }, 0);

      // Clean up the URL parameter without triggering a page refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url.toString());

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="dashboard-content p-6 space-y-6">
      {loginMessage && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
          {loginMessage}
        </div>
      )}

      {/* Render Header & User Badges */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {userData?.email && <p className="text-sm text-gray-500">Logged in as {userData.email}</p>}
        <CreditBadge />
      </div>

      {/* Main Feature Modules */}
      <LoadingBar />
      <Generator />
      <ImageGallery />
      <PricingTable />
    </div>
  );
}