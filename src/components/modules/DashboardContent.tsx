import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirebaseAuth } from '@/lib/firebase'; // 💡 Clean path alias import

// Core Layout & Module Component Path Aliases
import Generator from '@/components/modules/Generator';
import ImageGallery from '@/components/modules/ImageGallery';
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import CreditBadge from '@/components/CreditBadge';

export default function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 💡 Assigned to a dedicated variable so the compiler explicitly registers its usage
    const authInstance = getFirebaseAuth();

    const unsubscribe = authInstance.onAuthStateChanged((user: any) => {
      if (!user) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]); // 💡 The hook ends cleanly right here

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              AI Studio Dashboard
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Generate, iterate, and review your viral image assets.
            </p>
          </div>
          <div className="flex items-center">
            <CreditBadge />
          </div>
        </div>

        {/* Core Generator Control Module */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm h-fit">
            <Generator />
          </div>

          {/* Main Display Output Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-200">
              Generation History
            </h2>
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4">
              <ImageGallery />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}